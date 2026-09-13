// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {CommunityTreasury} from "../src/CommunityTreasury.sol";
import {DaoGovernor} from "../src/DaoGovernor.sol";

/// @notice Session 7 smoke test — full suite arrives in session 10.
contract DeploySmokeTest is Test {
    function test_DeployWiring() public {
        GovernanceToken token = new GovernanceToken(address(this), 1_000 ether);
        CommunityTreasury treasury = new CommunityTreasury();
        DaoGovernor governor = new DaoGovernor(address(token), address(treasury), 1 days, 100 ether);
        treasury.setGovernor(address(governor));

        assertEq(treasury.governor(), address(governor));
        assertEq(address(governor.token()), address(token));
        assertEq(address(governor.treasury()), address(treasury));
    }
}
