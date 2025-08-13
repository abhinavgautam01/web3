// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/StakingContract.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract TestContract is Test {
    StakingContractImplementatiton1 c;

    receive() external payable {}

    function setUp() public {
        c = new StakingContractImplementatiton1();
    }

    function testStake() public {
        uint value = 10 ether;
        c.stake{value: value}();
        assert(c.totalStaked() == value);
        assertEq(c.balances(address(this)), value);
    }

    function testUnStake() public {
        uint value = 10 ether;
        // vm.startPrank(0x53Fdc83Bf80Ce22901fae24DE0D4Db06Dab865b5);
        // vm.deal(0x53Fdc83Bf80Ce22901fae24DE0D4Db06Dab865b5, value);
        c.stake{value: value}();
        c.unstake(value);
        assert(c.totalStaked() == value - value);
    }
}
