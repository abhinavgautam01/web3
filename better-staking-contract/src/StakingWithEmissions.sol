// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "forge-std/Test.sol";

interface ITalwiinderToken{
    function mintTo(address _to, uint _amount) external;
}

event RewardsClaimed(address indexed _user, uint _amount);

contract StakingWitEmissions {
    mapping(address => uint) public stakes;
    uint public totalStake;
    uint public constant REWARD_PER_SEC_PER_ETH = 1;

    ITalwiinderToken public talwiinderToken;

    struct UserInfo {
        uint stakedAmount;
        uint rewardDebt;
        uint lastUpdate;
    }

    mapping(address=> UserInfo) public userInfo;

    constructor(ITalwiinderToken _token){
        talwiinderToken = _token;
    }

    function _updateRewards(address _user) internal {
        UserInfo storage user = userInfo[_user];

        if(user.lastUpdate == 0){
            user.lastUpdate = block.timestamp;
            return;
        }

        uint timeDiff = block.timestamp - user.lastUpdate;
        if(timeDiff == 0){
            return;
        }

        uint additionalReward = (user.stakedAmount * timeDiff * REWARD_PER_SEC_PER_ETH);

        user.rewardDebt += additionalReward;
        user.lastUpdate = block.timestamp;
    }

    function stake(uint _amount) external payable {
        require(_amount > 0, "_amount should be greater than zero.");
        require(msg.value == _amount, "ETH amount Mismatch.");

        _updateRewards(msg.sender);

        userInfo[msg.sender].stakedAmount += _amount;
        totalStake += _amount;
    }

    function unstake(uint _amount) external {
        require(_amount > 0, "_amount should be greater than zero.");
        UserInfo storage user = userInfo[msg.sender];
        require(user.stakedAmount >= _amount, "Not enough staked.");

        _updateRewards(msg.sender);
        user.stakedAmount -= _amount;
        totalStake -= _amount;

        payable(msg.sender).transfer(_amount);
    }

    function claimEmissions() public {
        _updateRewards(msg.sender);
        UserInfo storage user = userInfo[msg.sender];
        talwiinderToken.mintTo(msg.sender, user.rewardDebt);

        emit RewardsClaimed(msg.sender, user.rewardDebt);
        user.rewardDebt = 0;
    }

    function getRewards() public view returns (uint) {
        UserInfo storage user = userInfo[msg.sender];
        if (user.lastUpdate == 0) {
            return 0;
        }
        uint256 timeDiff = block.timestamp - user.lastUpdate;
        uint256 pending = (user.stakedAmount * timeDiff * REWARD_PER_SEC_PER_ETH) / 1e18;
        return user.rewardDebt + pending;
    }
}