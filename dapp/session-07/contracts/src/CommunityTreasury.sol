// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CommunityTreasury
/// @notice ETH vault controlled exclusively by the DAO governor (Session 5).
contract CommunityTreasury {
    address public governor;

    event GovernorSet(address indexed governor);
    event Deposited(address indexed from, uint256 amount);
    event Released(address indexed to, uint256 amount);

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice One-time wiring after DaoGovernor is deployed.
    function setGovernor(address governor_) external {
        require(governor == address(0), "Governor already set");
        require(governor_ != address(0), "Zero address");
        governor = governor_;
        emit GovernorSet(governor_);
    }

    /// @notice Send ETH to `to`. Only the governor may call this.
    function release(address payable to, uint256 amount) external {
        require(msg.sender == governor, "Not governor");
        require(to != address(0), "Zero address");
        require(address(this).balance >= amount, "Insufficient funds");

        (bool ok,) = to.call{value: amount}("");
        require(ok, "ETH transfer failed");

        emit Released(to, amount);
    }
}
