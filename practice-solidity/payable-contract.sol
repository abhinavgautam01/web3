// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Payable {
    uint public amount;

    function deposit() public payable {
        amount = msg.value;
    }

    function withdraw(address payable receiptant) public {
        payable(receiptant).transfer(amount);
        amount = 0;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}