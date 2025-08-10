// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Storage {
    uint public num;
    uint public multiplier = 1;

    constructor() {

    }

    function setNum(uint _num) public {
        num = multiplier * _num;
    }

    function setMultiplier(uint _multiplier) public {
        multiplier = _multiplier;
    }
}