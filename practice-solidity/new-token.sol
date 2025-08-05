// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract NewToken {
    address public owner;
    uint public totalSupply;
    mapping(address=> uint) public balances;
    string public name = "Talwiinder";
    string public symbol = "TWD";

    modifier onlyOnwer(){
        require(owner == msg.sender, "Only owner is allowed to mint tokens.");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function mint(uint amount) public onlyOnwer {
        balances[owner] += amount;
        totalSupply += amount;
    }

    function mintTo(address to, uint amount) public onlyOnwer{
        balances[to] += amount;
        totalSupply += amount;
    }

    function transfer(address to, uint amount) public {
        uint existingBalance = balances[msg.sender];
        require(existingBalance >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

}