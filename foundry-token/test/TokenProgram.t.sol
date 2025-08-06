// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/TokenProgram.sol";

contract TestTokenProgram is Test {
    TokenProgram c;

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint256 value);

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

        vm.expectEmit(true, true, false, true);
        emit Transfer(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);

        c.transfer(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);

        assertEq(c.balanceOf(address(this)), 50, "ok");
        assertEq(c.balanceOf(0xde49A9728ef9Bbb83969d74F878360732d42E12b), 50, "ok");

        vm.expectEmit(true, true, false, true);
        emit Transfer(0xde49A9728ef9Bbb83969d74F878360732d42E12b, address(this), 50);
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

    function testApprovalEmit() public {
        c.mint(address(this), 50);

        vm.expectEmit(true, true, false, true);
        emit Approval(address(this), 0xde49A9728ef9Bbb83969d74F878360732d42E12b, 20);
        c.approve(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 20);
    }

    function testStartPrank () public {
        c.mint(address(this), 100);
        c.transfer(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 50);

        vm.startPrank(0xde49A9728ef9Bbb83969d74F878360732d42E12b);
        c.transfer(address(this), 10);
        c.transfer(address(this), 10);
        c.transfer(address(this), 10);
        vm.stopPrank();
    }

    function testDealExample() public {
        address account = 0xde49A9728ef9Bbb83969d74F878360732d42E12b;

        vm.deal(account, 10 ether);

        assertEq(address(account).balance, 10 ether, "ok");
    }

    function testHoax() public{
        hoax(0xde49A9728ef9Bbb83969d74F878360732d42E12b, 100 ether);
        c.test{value:100 ether}();
        assertEq(c.getBalance(), 100 ether, "ok");
    }

}
