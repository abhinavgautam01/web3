// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { ERC20 } from  "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from  "@openzeppelin/contracts/access/Ownable.sol";

contract TalwiinderCoin is ERC20, Ownable{
    address stakingContract;
    constructor( address _stakingContract) ERC20("Talwiinder", "TWD") Ownable(msg.sender){
        stakingContract = _stakingContract;
    }

    function mintTo(address _to, uint _amount) public {
        require(msg.sender == stakingContract, "Can be only called by stakingContract.");
        _mint(_to, _amount);
    }

    function updateStakingContract(address _stakingContract) public onlyOwner {
        stakingContract = _stakingContract;
    }

}
