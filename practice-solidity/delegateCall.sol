// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

contract Storage {
    uint public num;
    address implementation;

    constructor(address _implementation){
        num = 0;
        implementation = _implementation;
    }

    function setNum(uint _num) public {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature("setNum(uint256)", _num)
        );
        require(success, "Error while Delegating Call..!");
    }
}

contract Implementation {
    uint public num;

    function setNum(uint _num) public {
        num = _num;
    }
}