// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {CommunityTreasury} from "../src/CommunityTreasury.sol";
import {DaoGovernor} from "../src/DaoGovernor.sol";

/// @notice Deploys token → treasury → governor, mints supply, funds treasury, wires permissions.
contract DeployDAO is Script {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether;
    uint256 public constant VOTING_PERIOD = 1 days;
    uint256 public constant QUORUM_VOTES = 100_000 ether;
    uint256 public constant TREASURY_FUND = 10 ether;

    function run() external {
        address deployer = msg.sender;

        vm.startBroadcast();

        GovernanceToken token = new GovernanceToken(deployer, INITIAL_SUPPLY);
        CommunityTreasury treasury = new CommunityTreasury();
        DaoGovernor governor = new DaoGovernor(address(token), address(treasury), VOTING_PERIOD, QUORUM_VOTES);

        treasury.setGovernor(address(governor));
        (bool funded,) = address(treasury).call{value: TREASURY_FUND}("");
        require(funded, "treasury fund failed");

        vm.stopBroadcast();

        console2.log("GovernanceToken", address(token));
        console2.log("CommunityTreasury", address(treasury));
        console2.log("DaoGovernor", address(governor));
        console2.log("Deployer / initial token holder", deployer);
    }
}
