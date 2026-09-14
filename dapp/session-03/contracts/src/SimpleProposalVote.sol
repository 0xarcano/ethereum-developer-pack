// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SimpleProposalVote
/// @notice Session 3 didactic monolith: one fixed proposal, one vote per address.
/// @dev Deploy and exercise in Remix (Deploy & Run). Switch accounts to vote.
contract SimpleProposalVote {
    string public proposal;
    uint256 public votesFor;
    uint256 public votesAgainst;
    mapping(address => bool) public hasVoted;

    event VoteCast(address indexed voter, bool support);

    constructor(string memory proposalText) {
        proposal = proposalText;
    }

    /// @notice Cast a single yes/no vote. Reverts if the caller already voted.
    function vote(bool support) external {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        if (support) {
            votesFor += 1;
        } else {
            votesAgainst += 1;
        }

        emit VoteCast(msg.sender, support);
    }

    /// @notice Read-only: proposal passes when yes votes strictly exceed no votes.
    function isApproved() external view returns (bool) {
        return votesFor > votesAgainst;
    }
}
