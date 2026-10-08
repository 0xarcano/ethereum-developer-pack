// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {CommunityTreasury} from "../src/CommunityTreasury.sol";
import {DaoGovernor} from "../src/DaoGovernor.sol";
import {SimpleProposalVote} from "../src/SimpleProposalVote.sol";

/// @notice Smoke test: deploy wiring succeeds and treasury recognizes the governor.
contract DeploySmokeTest is Test {
    function test_DeployWiresGovernor() public {
        GovernanceToken token = new GovernanceToken(address(this), 1_000_000 ether);
        CommunityTreasury treasury = new CommunityTreasury();
        DaoGovernor governor = new DaoGovernor(address(token), address(treasury), 1 days, 100_000 ether);
        treasury.setGovernor(address(governor));

        assertEq(treasury.governor(), address(governor));
        assertEq(address(governor.token()), address(token));
        assertEq(address(governor.treasury()), address(treasury));
    }

    function test_DeploySimpleProposalVote() public {
        string memory proposalText = "Hackathon CEDIA 2026";
        SimpleProposalVote voteContract = new SimpleProposalVote(proposalText);

        assertEq(voteContract.proposal(), proposalText);
        assertEq(voteContract.votesFor(), 0);
        assertEq(voteContract.votesAgainst(), 0);
        assertFalse(voteContract.hasVoted(address(this)));

        voteContract.vote(true);
        assertTrue(voteContract.hasVoted(address(this)));
        assertEq(voteContract.votesFor(), 1);
        assertTrue(voteContract.isApproved());
    }
}

