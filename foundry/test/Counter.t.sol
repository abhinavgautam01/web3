// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/Counter.sol";

contract TestCounter is Test {
    Counter c;
    function setUp() public{
        c = new Counter(5);
    }

    function testIncreament() public {
        c.increment();
        c.increment();
        assertEq(c.getNum(), 7);
    }
    
    function testDecrement() public {
        c.decrement();
        c.decrement();
        assertEq(c.getNum(), 3, "ok");
    }

    function test_RevertNegativeNum() public {
        c.decrement();
        c.decrement();
        c.decrement();
        c.decrement();
        c.decrement();
        vm.expectRevert();
        c.decrement();
    }
}
