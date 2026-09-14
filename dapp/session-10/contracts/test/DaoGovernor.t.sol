// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {CommunityTreasury} from "../src/CommunityTreasury.sol";
import {DaoGovernor} from "../src/DaoGovernor.sol";

contract DaoGovernorTest is Test {
    GovernanceToken internal token;
    CommunityTreasury internal treasury;
    DaoGovernor internal governor;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");
    address internal carol = makeAddr("carol");
    address internal recipient = makeAddr("recipient");

    uint256 internal constant SUPPLY = 1_000_000 ether;
    uint256 internal constant VOTING_PERIOD = 1 days;
    uint256 internal constant QUORUM = 100_000 ether;
    uint256 internal constant PAYOUT = 1 ether;

    function setUp() public {
        token = new GovernanceToken(address(this), SUPPLY);
        treasury = new CommunityTreasury();
        governor = new DaoGovernor(address(token), address(treasury), VOTING_PERIOD, QUORUM);
        treasury.setGovernor(address(governor));

        vm.deal(address(treasury), 10 ether);

        token.transfer(alice, 200_000 ether);
        token.transfer(bob, 50_000 ether);
        // carol keeps 0 tokens
    }

    function _createProposal() internal returns (uint256 proposalId) {
        proposalId = governor.createProposal("Pay workshop", payable(recipient), PAYOUT);
    }

    function test_HappyPath_ExecutePaysRecipient() public {
        uint256 proposalId = _createProposal();

        vm.prank(alice);
        governor.vote(proposalId, true);

        vm.prank(bob);
        governor.vote(proposalId, false);

        vm.warp(block.timestamp + VOTING_PERIOD + 1);

        uint256 beforeBal = recipient.balance;
        governor.execute(proposalId);
        assertEq(recipient.balance, beforeBal + PAYOUT);

        (,,,,,, bool executed) = governor.proposals(proposalId);
        assertTrue(executed);
    }

    function test_Revert_DoubleVote() public {
        uint256 proposalId = _createProposal();

        vm.prank(alice);
        governor.vote(proposalId, true);

        vm.prank(alice);
        vm.expectRevert("Already voted");
        governor.vote(proposalId, false);
    }

    function test_Revert_VoteWithoutTokens() public {
        uint256 proposalId = _createProposal();

        vm.prank(carol);
        vm.expectRevert("No voting power");
        governor.vote(proposalId, true);
    }

    function test_Revert_ExecuteBeforeDeadline() public {
        uint256 proposalId = _createProposal();

        vm.prank(alice);
        governor.vote(proposalId, true);

        vm.expectRevert("Voting active");
        governor.execute(proposalId);
    }

    function test_Revert_ExecuteWithoutQuorum() public {
        uint256 proposalId = _createProposal();

        // bob alone: 50k < 100k quorum
        vm.prank(bob);
        governor.vote(proposalId, true);

        vm.warp(block.timestamp + VOTING_PERIOD + 1);

        vm.expectRevert("Quorum not reached");
        governor.execute(proposalId);
    }

    function test_Revert_UnauthorizedTreasuryRelease() public {
        vm.prank(alice);
        vm.expectRevert("Not governor");
        treasury.release(payable(alice), 1 ether);
    }

    /// @notice Weighted yes votes from a single voter cannot exceed that voter's balance,
    /// and therefore cannot exceed totalSupply.
    function testFuzz_VoteWeightNeverExceedsBalance(uint256 aliceShare) public {
        aliceShare = bound(aliceShare, 1, SUPPLY);

        // Fresh token distribution for fuzz isolation
        GovernanceToken t = new GovernanceToken(address(this), SUPPLY);
        CommunityTreasury tr = new CommunityTreasury();
        DaoGovernor g = new DaoGovernor(address(t), address(tr), VOTING_PERIOD, 1);
        tr.setGovernor(address(g));
        vm.deal(address(tr), 1 ether);

        t.transfer(alice, aliceShare);

        uint256 proposalId = g.createProposal("Fuzz pay", payable(recipient), 1 wei);

        vm.prank(alice);
        g.vote(proposalId, true);

        (,,, uint256 votesFor,,,) = g.proposals(proposalId);
        assertLe(votesFor, aliceShare);
        assertLe(votesFor, t.totalSupply());
    }
}
