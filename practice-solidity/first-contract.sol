// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract User {
    struct Person {
        string name;
        uint age;
        address addr;
    }

    Person p1;

    constructor() {
        p1 = Person (
            "Golu",
            21,
            msg.sender
        );
    }

    function getPerson() public view returns(string memory){
        return p1.name;
    }
}