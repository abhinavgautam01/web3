// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/StakingContract.sol";

contract TestContract is Test {
    StakingContract c;

    receive ()external payable{}

    function setUp() public {
        c = new StakingContract();
    }

    function testStake () public {
        c.stake{value: 200}();
        assertEq(c.balanceOf(address(this)), 200);
    }

    function testStakeFail () public {
        c.stake{value: 200}();
        vm.expectRevert();
        c.unstake(300);
    }

    function testUnStake () public {
        c.stake{value: 200}();
        assertEq(c.balanceOf(address(this)), 200);
        c.unstake(200);
        assertEq(c.balanceOf(address(this)), 0);
    }

}
