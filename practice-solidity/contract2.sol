// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

interface IStorage{
    function getNum() external view returns(uint);
    function add() external;
}

contract MainContract {


    function proxyAdd() public {
        IStorage(0xDA0bab807633f07f013f94DD0E6A4F96F8742B53).add();
    }

    function proxyGetNum() public view returns(uint){
        return IStorage(0xDA0bab807633f07f013f94DD0E6A4F96F8742B53).getNum();
    }

}