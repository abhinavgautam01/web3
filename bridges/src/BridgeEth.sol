// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeEth is Ownable {

    address public tokenAddress;
    mapping(address=>uint) public pendingBalances;

    event Deposit(address indexed depositor, uint amount);

    constructor(address _tokenAddress)Ownable(msg.sender){
        tokenAddress = _tokenAddress;
    }

    function lock(IERC20 _tokenAddress, uint amount)public {
        require(address(_tokenAddress) == tokenAddress);
        require(_tokenAddress.allowance(msg.sender, address(this)) >= amount);
        require(_tokenAddress.transferFrom(msg.sender, address(this), amount));
        emit Deposit(msg.sender, amount);
    }

    function unlock(IERC20 _tokenAddress ,uint amount) public {
        require(address(_tokenAddress) == tokenAddress);
        require(pendingBalances[msg.sender] >= amount);
        pendingBalances[msg.sender] -= amount;
        _tokenAddress.transfer(msg.sender, amount);
    }

    function burnedOnOtherChain(address user_account, uint amount) public onlyOwner {
        pendingBalances[user_account] += amount;
    }
}
