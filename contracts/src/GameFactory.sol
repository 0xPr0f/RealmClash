// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Game} from "./Game.sol";

contract RealmClash {
    event GameCreated (address indexed initiator, address indexed challengee, uint[] initiatordeck);
    mapping(address => bool) public _allowedOwners;
    mapping (address => uint) public addressToWinCount;
    mapping (address => uint) public addressToLoseCount;
    address[] public allGames;

    modifier Owners(){
        require (_allowedOwners[msg.sender], "Not allowed");
        _;
    }
    function _addOwners(address _addr) public Owners {
        _allowedOwners[_addr] = true;
    }
     
     function createNewGameManual(address _2ndPlayer, uint[] memory _1stPlayerCharDeck) external {
        Game game = new Game(msg.sender, _2ndPlayer, _1stPlayerCharDeck);
        allGames.push(address(game));

        emit GameCreated(msg.sender, _2ndPlayer, _1stPlayerCharDeck); 
     }

//These functions are not access controlled yet

     function addWin (address _addr) external {
        addressToWinCount[_addr]++;
     }
    function addLose (address _addr) external {
        addressToLoseCount[_addr]++;
     }
}