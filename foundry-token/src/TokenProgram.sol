// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenProgram is ERC20, Ownable {

    constructor() ERC20("Talwiinder", "TWD") Ownable(msg.sender) {

    }

    function mint(address to, uint amount) public onlyOwner() {
        _mint(to, amount);
    }

    function test() public payable {
        
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}
