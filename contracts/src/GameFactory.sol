// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Game} from "./Game.sol";

contract RealmClash {
    mapping(address => bool) public _allowedOwners;
    address[] public allGames;

    modifier Owners() {
        require(_allowedOwners[msg.sender], "Not allowed");
        _;
    }

    function _addOwners(address _addr) public Owners {
        _allowedOwners[_addr] = true;
    }

    function createNewGameManual(
        address _2ndPlayer,
        uint[] memory _1stPlayerCharDeck
    ) external {
        Game game = new Game(msg.sender, _2ndPlayer, _1stPlayerCharDeck);
        allGames.push(address(game));

        // probably emit an event
    }
}
