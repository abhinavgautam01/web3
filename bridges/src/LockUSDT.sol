// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { IERC20 } from "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LockUSDT {
    address private usdtAddress;
    mapping(address=> uint) public pendingAmount;

    constructor(address _usdtAddress){
        usdtAddress = _usdtAddress;
    }

    function deposit(uint amount) public {
        require(IERC20(usdtAddress).allowance(msg.sender, address(this)) >= amount, "Insufficient allowance amount.");
        IERC20(usdtAddress).transferFrom(msg.sender, address(this), amount);
        pendingAmount[msg.sender] += amount;
    }

    function withdraw() public {
        uint remainingAllowance = pendingAmount[msg.sender];
        IERC20(usdtAddress).transfer(msg.sender, remainingAllowance);
        pendingAmount[msg.sender] = 0;
    }
}
