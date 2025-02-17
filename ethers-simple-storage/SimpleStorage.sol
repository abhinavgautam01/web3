
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    mapping(string=>uint256) public nameToFavoriteNumber;

    struct People{
        uint favoriteNumber;
        string name;
    }
    
    People[] public people;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns(uint256){
        return favoriteNumber;
    }

    //calldata, memory, storage
    function addPerson(uint256 _favoriteNumber, string calldata _name) public {
        // _name = "cat";   this can be used with memory, calldata stores variable temporarily and don't allow that variable to change values...
        //whereas memory keyword stores the data temporarily and also allows to change the value of that variable..!
        //storage keyword stores the data permanently, and also allows to change the value of the variable...
        people.push(People({favoriteNumber: _favoriteNumber, name: _name}));
        // person.push(People(_favoriteNumber, _name));

        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
