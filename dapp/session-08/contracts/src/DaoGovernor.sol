// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20Balance {
    function balanceOf(address account) external view returns (uint256);
}

interface ICommunityTreasury {
    function release(address payable to, uint256 amount) external;
}

/// @title DaoGovernor
/// @notice Token-weighted proposals that can spend from CommunityTreasury (Session 5).
/// @dev Vote weight = token balanceOf(voter) at vote time (didactic; not a snapshot).
contract DaoGovernor {
    struct Proposal {
        string description;
        address payable recipient;
        uint256 amount;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
    }

    IERC20Balance public immutable token;
    ICommunityTreasury public immutable treasury;
    uint256 public immutable votingPeriod;
    uint256 public immutable quorumVotes;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description,
        address recipient,
        uint256 amount,
        uint256 deadline
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, address indexed recipient, uint256 amount);

    constructor(address token_, address treasury_, uint256 votingPeriod_, uint256 quorumVotes_) {
        require(token_ != address(0) && treasury_ != address(0), "Zero address");
        token = IERC20Balance(token_);
        treasury = ICommunityTreasury(treasury_);
        votingPeriod = votingPeriod_;
        quorumVotes = quorumVotes_;
    }

    function createProposal(string calldata description, address payable recipient, uint256 amount)
        external
        returns (uint256 proposalId)
    {
        require(bytes(description).length > 0, "Empty description");
        require(recipient != address(0), "Zero address");
        require(amount > 0, "Zero amount");

        proposalId = ++proposalCount;
        uint256 deadline = block.timestamp + votingPeriod;
        proposals[proposalId] = Proposal({
            description: description,
            recipient: recipient,
            amount: amount,
            votesFor: 0,
            votesAgainst: 0,
            deadline: deadline,
            executed: false
        });

        emit ProposalCreated(proposalId, msg.sender, description, recipient, amount, deadline);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.deadline != 0, "Invalid proposal");
        require(block.timestamp <= p.deadline, "Voting closed");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /// @notice After the deadline, release treasury funds if the proposal passed quorum.
    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(p.deadline != 0, "Invalid proposal");
        require(block.timestamp > p.deadline, "Voting active");
        require(!p.executed, "Already executed");
        require(p.votesFor >= quorumVotes, "Quorum not reached");
        require(p.votesFor > p.votesAgainst, "Proposal failed");

        p.executed = true;
        treasury.release(p.recipient, p.amount);

        emit ProposalExecuted(proposalId, p.recipient, p.amount);
    }
}
