// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract User {
    struct Person {
        string name;
        uint age;
        address addr;
    }

    mapping(address=>Person) public persons;

    function setPersons(string memory _name, uint age)public {
        persons[msg.sender]=Person({
            name: _name,
            age: age,
            addr: msg.sender
        });
    }

    function getPerson() public view returns(string memory, uint, address){
        Person memory person = persons[msg.sender];
        return (person.name, person.age, person.addr);
    }
}