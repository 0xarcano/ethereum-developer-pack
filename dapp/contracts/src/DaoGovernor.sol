// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICommunityTreasury {
    function release(address payable to, uint256 amount) external;
}

/// @title DaoGovernor
/// @notice Token-weighted proposals that can spend from CommunityTreasury.
/// @dev Vote weight = token balanceOf(voter) at vote time (didactic; not a snapshot).
contract DaoGovernor is ReentrancyGuard {
    struct Proposal {
        string description;
        address payable recipient;
        uint256 amount;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
    }

    IERC20 public immutable token;
    ICommunityTreasury public immutable treasury;
    uint256 public immutable votingPeriod;
    uint256 public immutable quorumVotes;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    error ZeroAddress();
    error EmptyDescription();
    error ZeroAmount();
    error InvalidProposal();
    error VotingClosed();
    error AlreadyVoted();
    error ZeroVotingPower();
    error VotingActive();
    error AlreadyExecuted();
    error QuorumNotReached();
    error ProposalFailed();

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
        if (token_ == address(0) || treasury_ == address(0)) revert ZeroAddress();
        token = IERC20(token_);
        treasury = ICommunityTreasury(treasury_);
        votingPeriod = votingPeriod_;
        quorumVotes = quorumVotes_;
    }

    function createProposal(string calldata description, address payable recipient, uint256 amount)
        external
        returns (uint256 proposalId)
    {
        if (bytes(description).length == 0) revert EmptyDescription();
        if (recipient == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

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
        if (p.deadline == 0) revert InvalidProposal();
        if (block.timestamp > p.deadline) revert VotingClosed();
        if (hasVoted[proposalId][msg.sender]) revert AlreadyVoted();

        uint256 weight = token.balanceOf(msg.sender);
        if (weight == 0) revert ZeroVotingPower();

        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /// @notice Permissionless execution after the deadline if the proposal passed quorum.
    function execute(uint256 proposalId) external nonReentrant {
        Proposal storage p = proposals[proposalId];
        if (p.deadline == 0) revert InvalidProposal();
        if (block.timestamp <= p.deadline) revert VotingActive();
        if (p.executed) revert AlreadyExecuted();

        uint256 totalVotes = p.votesFor + p.votesAgainst;
        if (totalVotes < quorumVotes) revert QuorumNotReached();
        if (p.votesFor <= p.votesAgainst) revert ProposalFailed();

        // Effects before interaction (CEI)
        p.executed = true;
        emit ProposalExecuted(proposalId, p.recipient, p.amount);

        treasury.release(p.recipient, p.amount);
    }

    function isApproved(uint256 proposalId) external view returns (bool) {
        Proposal storage p = proposals[proposalId];
        if (p.deadline == 0) return false;
        uint256 totalVotes = p.votesFor + p.votesAgainst;
        return totalVotes >= quorumVotes && p.votesFor > p.votesAgainst;
    }
}
