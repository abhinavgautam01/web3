// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/TalwiinderCoin.sol";

contract TestContract is Test {
    TalwiinderCoin c;

    function setUp() public {
        c = new TalwiinderCoin(address(this));
    }

    function testInitialSupply() public {
        assert(c.totalSupply() == 0);
        assertEq(c.totalSupply(), 0);
    }

    function testMint() public {
        c.mintTo(address(this), 100);
        assertEq(c.balanceOf(address(this)), 100);
    }

    function testMintFail() public {
        vm.expectRevert();
        vm.prank(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f);
        c.mintTo(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f, 100);
    }

    function testChangeStakingAddress() public {
        c.updateStakingContract(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f);
        vm.prank(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f);
        c.mintTo(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f, 100);
        assertEq(c.balanceOf(0x1487F5929f74B1F0c3e86949739348c8f66BBc8f), 100);
    }

}
