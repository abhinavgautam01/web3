// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBUSDT is IERC20 {
    function mint(address _to, uint _amount) external;
    function burn(address _from, uint _amount) external;
}

contract BridgeBase is Ownable{
    address public tokenAddress;
    mapping (address => uint) public pendingBalances;

    event Burn(address indexed from , uint _amount);

    constructor(address _tokenAddress) Ownable(msg.sender){
        tokenAddress = _tokenAddress;
    }

    function mint(IBUSDT _tokenAddress, uint _amount) public {
        require(pendingBalances[msg.sender]>=_amount);
        pendingBalances[msg.sender] -= _amount;
        _tokenAddress.mint(msg.sender, _amount);
    }

    function burn(IBUSDT _tokenAddress, uint _amount) public {
        require(address(_tokenAddress)==tokenAddress);
        _tokenAddress.burn(msg.sender, _amount);
        emit Burn(msg.sender, _amount);
    }

    function depositHappenedOnOtherSide(address userAccount, uint _amount) public {
        pendingBalances[userAccount] += _amount;
    }

}