// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract SanToken is ERC20 , Ownable{
    constructor()ERC20("SanToken", "WSAN") Ownable(msg.sender){
    }

    function mint(address _to, uint _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _from, uint _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}

