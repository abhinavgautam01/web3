// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract StakingContract {
    mapping(address => uint) public balances;
    mapping(address => uint) public unclaimedRewards;
    mapping(address => uint) public lastUpdatedTime;
    uint totalSupply ;

    event Staked(address indexed user, uint amount);
    event Unstaked(address indexed user, uint amount);
    event RewardsClaimed(address indexed user, uint amount);

    function stake() public payable{
        require(msg.value>0, "Amount should be greater than zero.");

        if(lastUpdatedTime[msg.sender] == 0){
            lastUpdatedTime[msg.sender] = block.timestamp;
        }else {
            unclaimedRewards[msg.sender] += (block.timestamp - lastUpdatedTime[msg.sender]) * balances[msg.sender];
            lastUpdatedTime[msg.sender] = block.timestamp;
        }
        
        balances[msg.sender] += msg.value;
        totalSupply += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint _amount) public {
        require(_amount > 0, "Amount should be greater than zero.");
        require(balances[msg.sender] >= _amount, "Insufficient amount for unstaking");

        balances[msg.sender] -= _amount;
        totalSupply -= _amount;

        payable(msg.sender).transfer(_amount);
        emit Unstaked(msg.sender, _amount);
    }

    function claimRewards(uint _amount) public {
        uint currentReward = unclaimedRewards[msg.sender];
        uint updateTime = lastUpdatedTime[msg.sender];
        uint newReward = (block.timestamp - updateTime) * balances[msg.sender];

        // transfer logic : currentReward + newReward
        
        require(_amount <= unclaimedRewards[msg.sender]);
        unclaimedRewards[msg.sender] -= _amount;
        lastUpdatedTime[msg.sender] = block.timestamp;
        emit RewardsClaimed(msg.sender, balances[msg.sender]);
    }

    function getRewards(address _address) public view returns (uint){
        uint currentReward = unclaimedRewards[_address];
        uint updateTime = lastUpdatedTime[_address];
        uint newReward = (block.timestamp - updateTime) * balances[_address];
        return currentReward + newReward ;

    }

    function balanceOf(address _address) public view returns (uint) {
        return balances[_address];
    }
}
