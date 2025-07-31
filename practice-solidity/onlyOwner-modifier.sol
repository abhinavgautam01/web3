// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract ModifierCheck {
    address owner;
    uint number;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "Only owner can call this function..!");
        _;
    }

    function add(uint a) public onlyOwner {
       number = number + a;
    }

    function subtract(uint a) public onlyOwner {
        number = number - a;
    }
    
    function getNumber()public view returns(uint){
        return number;
    }
    
    function getAddandMulTwoNumbers(uint a, uint b)public view onlyOwner returns(uint, uint){
        return (a+b, a*b);
    }

}