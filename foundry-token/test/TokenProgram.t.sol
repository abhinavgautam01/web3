// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/TokenProgram.sol";

contract TestTokenProgram is Test {
    TokenProgram c;

    function setUp() public {
        c = new TokenProgram();
    }

    function testMint() public {
        c.mint(address(this), 100);
        assertEq(c.balanceOf(address(this)), 100, "ok");
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 0, "Ok");
        c.mint(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 50, "Ok");
    }

    function testTransfer() public {
        c.mint(address(this), 100);
        c.transfer(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);

        assertEq(c.balanceOf(address(this)), 50, "ok");
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 50, "ok");

        vm.prank(0xde49A9728ef9Bbb83969d74F878360732d42E12b);
        c.transfer(address(this), 50);


        assertEq(c.balanceOf(address(this)), 100, "ok");
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 0, "ok");
    }

    function testApproval() public {
        c.mint(address(this), 100);
        c.approve(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);
        assertEq(c.allowance(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b), 50, "ok");

        vm.prank(0xde49A9728ef9Bbb83969d74F878360732d42E12b);
        c.transferFrom(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b, 30);

        assertEq(c.balanceOf(address(this)), 70, "ok");
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 30, "ok");

        assertEq(c.allowance(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b), 20, "ok");
    }
    
    function testAllowanceFail() public {
        c.mint(address(this), 100);
        c.approve(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 10);

        vm.prank(0xde49A9728ef9Bbb83969d74F878360732d42E12b);
        vm.expectRevert();
        c.transferFrom(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b, 11);
    }

    function testTransferFail() public {
        c.mint(address(this), 100);

        vm.expectRevert();
        c.transfer(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 110);
    }
}
