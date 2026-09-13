// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CommunityTreasury
/// @notice ETH vault controlled exclusively by the DAO governor.
contract CommunityTreasury {
    address public governor;

    error NotGovernor();
    error GovernorAlreadySet();
    error ZeroAddress();
    error TransferFailed();
    error InsufficientBalance();

    event GovernorSet(address indexed governor);
    event Deposited(address indexed from, uint256 amount);
    event Released(address indexed to, uint256 amount);

    modifier onlyGovernor() {
        if (msg.sender != governor) revert NotGovernor();
        _;
    }

    /// @notice Wire the governor after both contracts are deployed (once).
    function setGovernor(address newGovernor) external {
        if (governor != address(0)) revert GovernorAlreadySet();
        if (newGovernor == address(0)) revert ZeroAddress();
        governor = newGovernor;
        emit GovernorSet(newGovernor);
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Release ETH to a recipient. Only the governor may call.
    function release(address payable to, uint256 amount) external onlyGovernor {
        if (to == address(0)) revert ZeroAddress();
        if (amount > address(this).balance) revert InsufficientBalance();

        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Released(to, amount);
    }
}
