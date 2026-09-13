// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title GovernanceToken
/// @notice Didactic ERC-20 used as membership / voting weight for the Mini-DAO.
contract GovernanceToken is ERC20 {
    constructor(address initialHolder, uint256 initialSupply) ERC20("CEDIA Governance", "CGOV") {
        require(initialHolder != address(0), "Zero holder");
        require(initialSupply > 0, "Zero supply");
        _mint(initialHolder, initialSupply);
    }
}
