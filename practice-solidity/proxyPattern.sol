// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract StorageProxy {
    uint public num;
    address public implementation;

    constructor(address _implementation){
        num = 0;
        implementation = _implementation;
    }

    function setNum(uint _num)public {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature("setNum(uint256)", _num)
        );
        require(success, "Error while delegating call..!");
    }

    function setImplementation(address _newImplementation)public {
        implementation = _newImplementation;
    }

}

contract ImplementationV1 {
    uint public num;

    function setNum (uint _num) public {
        num = _num;
    }
}

contract ImplementationV2 {
    uint public num;

    function setNum (uint _num) public {
        num = _num * 2;
    }
}

contract ImplementationV3 {
    uint public num;

    function setNum (uint _num) public {
        num = _num * 3;
    }
}