// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract NewToken {
    address public owner;
    uint public totalSupply;
    mapping(address=> uint) public balances;
    mapping(address=>mapping(address=>uint)) public allowances;
    string public name = "Talwiinder";
    string public symbol = "TWD";
    uint public decimals = 6;

    event Transfer(address indexed from, address indexed to , uint value);
    event Approve(address owner, address indexed spender, uint value);

    modifier onlyOnwer(){
        require(owner == msg.sender, "Only owner is allowed to mint tokens.");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function mint(uint amount) public onlyOnwer {
        balances[owner] += amount;
        totalSupply += amount;
    }

    function mintTo(address to, uint amount) public onlyOnwer{
        balances[to] += amount;
        totalSupply += amount;
    }

    function transfer(address to, uint amount) public {
        uint existingBalance = balances[msg.sender];
        require(existingBalance >= amount, "Insufficient balance to transfer");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function burn(uint amount) public {
        uint existingBalance = balances[msg.sender];
        require(existingBalance >= amount, "Insufficient balance to burn.");
        balances[msg.sender] -= amount;
        totalSupply -= amount;
    }

    function approve(address _to, uint _value) public returns(bool success){
        allowances[msg.sender][_to] = _value;
        emit Approve(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public {
        uint existingBalance = balances[_from];
        require(existingBalance>=_value, "Insufficient balance in From allowed spent account.");

        uint allowedAllowance = allowances[_from][msg.sender];
        require(allowedAllowance >= _value, "Allowance balance exceeded.");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
    }

}