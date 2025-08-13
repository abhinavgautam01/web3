// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract UpgradableStakingContract {
    mapping(address=> uint) public balances;
    uint public totalStaked;
    address implementation;

    constructor(address _implementation){
        implementation = _implementation;
    }

    function setImplementation (address _implementation) public {
        implementation = _implementation;
    }

    fallback() external payable{
        (bool success, ) = implementation.delegatecall(msg.data);
        require(success, "Failed while delegating call.");
    }

    receive() external payable { }
}

contract StakingContractImplementatiton1 {
    mapping(address=> uint) public balances;
    uint public totalStaked;

    event Staked(address indexed user, uint amount);
    event UnStaked(address indexed user, uint amount);

    function stake() public payable {
        require(msg.value>0, "amount should be greater than 0");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }   

    function unstake(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance to unstake.");
        require(_amount > 0, "Amount should be greater than zero.");
        balances[msg.sender] -= _amount;
        totalStaked -= _amount;

        payable(msg.sender).transfer(_amount /2);

        emit UnStaked(msg.sender, _amount);
    }

    function contractBalance() public view returns(uint) {
         return address(this).balance;
    }
}

contract StakingContractImplementatiton2 {
    mapping(address=> uint) public balances;
    uint public totalStaked;

    event Staked(address indexed user, uint amount);
    event UnStaked(address indexed user, uint amount);

    function stake() public payable {
        require(msg.value>0, "amount should be greater than 0");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }   

    function unstake(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance to unstake.");
        require(_amount > 0, "Amount should be greater than zero.");
        balances[msg.sender] -= _amount;
        totalStaked -= _amount;

        payable(msg.sender).transfer(_amount);

        emit UnStaked(msg.sender, _amount);
    }

    function contractBalance() public view returns(uint) {
         return address(this).balance;
    }
}
