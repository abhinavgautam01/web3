// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Will {
    address private owner;
    address payable private recepient;
    uint tenYears;
    uint startTime;
    uint public lastVisited;

    constructor(address payable _recepient) payable {
        owner = msg.sender;
        recepient = _recepient;
        tenYears = 1 hours * 24 * 365 * 10;
        startTime = block.timestamp;
        lastVisited = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Should be owner only");
        _;
    }

    modifier onlyRecepient() {
        require(msg.sender == recepient, "Should be a valid recepient");
        _;
    }

    function deposit () public payable onlyOwner {
        lastVisited = block.timestamp;
    }
    
    function ping()public{
        lastVisited = block.timestamp;
    }

    function changeRecepient(address payable _recepient)onlyOwner public {
        recepient = _recepient;
    }

    function claim() external onlyRecepient {
        require(lastVisited < block.timestamp - tenYears, "Can't claim, owner is still alive..!");
        payable(recepient).transfer(address(this).balance);
    }

}