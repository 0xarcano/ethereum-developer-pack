// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {SimpleProposalVote} from "../src/SimpleProposalVote.sol";

/// @notice Deploys the didactic SimpleProposalVote monolith for Stage 1 (HTML + TS + Viem).
contract DeploySimpleVote is Script {
    string public constant DEFAULT_PROPOSAL = "Aprobar financiamiento para el Hackathon CEDIA 2026";

    function run() external {
        address deployer = msg.sender;

        vm.startBroadcast();
        SimpleProposalVote voteContract = new SimpleProposalVote(DEFAULT_PROPOSAL);
        vm.stopBroadcast();

        console2.log("=== SimpleProposalVote Deployed ===");
        console2.log("Contract Address:", address(voteContract));
        console2.log("Proposal:", DEFAULT_PROPOSAL);
        console2.log("Deployer:", deployer);
    }
}
