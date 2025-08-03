// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Will {
    address private owner;
    address private recepient;
    uint private amount;
    uint private ping;

    constructor(address _recepient) payable {
        owner = msg.sender;
        recepient = _recepient;
        amount = msg.value;
        tenYears = 1 hours * 24 * 365 * 10;
        startTime = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Its should be a owner");
        _;
    }

    modifier onlyRecepient() {
        require(msg.sender == recepient, "Its should be a valid recepient");
        _;
    }

    function changeRecepient(address _recepient)onlyOwner public {
        recepient = _recepient;
    }

    function pingM() onlyOwner public {
        ping = 0;
    }

    function claim(address from)external {
        User memory targetUser = users[from];
        uint date = block.timestamp - tenYears;
        require(targetUser.nominee == msg.sender);
        require(targetUser.lastSeen < date);
        payable(msg.sender).transfer(targetUser.amount);
    }

}