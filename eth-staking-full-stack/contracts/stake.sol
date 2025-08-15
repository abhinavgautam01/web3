// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract StakingContract {
    mapping(address=> uint) public balances;
    uint public totalSupply;

    event ETHStaked(address indexed _user, uint _amount);
    event ETHUnStaked(address indexed _user, uint _amount);

    function stake(uint _amount) public payable {
        require(_amount == msg.value, "ETH send and the amount mismatched");
        require(_amount > 0, "Amount should be greater than zero.");

        balances[msg.sender] += _amount;
        totalSupply += _amount;

        emit ETHStaked(msg.sender, _amount);
    }

    function unstake(uint _amount) public{
        require(_amount > 0, "Amount should be greater than zero.");
        require(_amount <= balances[msg.sender], "Amount is greater than the amount Staked.");

        balances[msg.sender] -= _amount;
        totalSupply -= _amount;
        payable(msg.sender).transfer(_amount);

        emit ETHUnStaked(msg.sender, _amount);
    }
}