// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { Ownable } from "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract BridgeBase {
    constructor() Ownable(msg.sender){

    }

    function mint() public {

    }

    function burn() public {

    }

    function depositHappenedOnOtherSide() public {

    }

}