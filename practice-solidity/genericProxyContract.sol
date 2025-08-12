// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract GenericStorageProxy {
    uint public num;
    address implementation;
    event FallbackCalled();

    constructor(address _implementation){
        implementation = _implementation;
    }

    fallback() external  { 
        ( bool success, ) = implementation.delegatecall(msg.data);
        if(!success){
            revert();
        }

        emit FallbackCalled();
    }

    function setImplementation (address _implementation) public {
        implementation = _implementation;
    }
}

contract Implementation1 {
    uint public num;

    /// 0xcd16ecbf0000000000000000000000000000000000000000000000000000000000000002
    function setNum (uint _num)public {
        num = _num;
    }
}

contract Implementation2 {
    uint public num;
    address implementation;

    function setNum (uint _num)public {
        num = _num;
    } 

    /// 0x6223a47b0000000000000000000000000000000000000000000000000000000000000002
    function putNum (uint _num) public {
        num = _num * 2;
    }
}