// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Game} from "./Game.sol";
/**
 * @title RealmClash
 * @dev Contract for managing Realm Clash games and player statistics.
 */
contract RealmFactory {
    // Event emitted when a new game is created
    event GameCreated (address indexed initiator, address indexed challengee, uint[] initiatorDeck);
    
    // Mapping to track allowed contract owners
    mapping(address => bool) private _allowedOwners;

    // Mapping to track player win counts
    mapping (address => uint) private _addressToWinCount;

    // Mapping to track player lose counts
    mapping (address => uint) private _addressToLoseCount;

    // Mapping to track players' participation in games
    mapping (address => address[]) private _playerToGames;

    // Address of the CharacterCard contract
    address public characterCardAddress; // Set during contract deployment

    uint private gameIdCounter;

    // Array to store all game contracts
    address[] private _allGames;

    // Modifier to restrict access to contract owners
    modifier onlyOwners(){
        require (_allowedOwners[msg.sender], "Not allowed");
        _;
    }

    /**
     * @dev Constructor to set contract owner.
     */
    constructor() {
        _allowedOwners[msg.sender] = true;
    }

    /**
     * @dev Add an address to the list of allowed owners.
     * @param _addr The address to add.
     */
    function addOwner(address _addr) external onlyOwners {
        _allowedOwners[_addr] = true;
    }
     
    /**
     * @dev Create a new game manually between two players.
     * @param _2ndPlayer The address of the second player.
     * @param _1stPlayerCharDeck The deck of the first player.
     */
    function createNewGameManual(address _2ndPlayer, uint[] memory _1stPlayerCharDeck) external {
        gameIdCounter++;
        // Create a new Game contract
        Game game = new Game(msg.sender, _2ndPlayer, _1stPlayerCharDeck, address(this), characterCardAddress,gameIdCounter);
        // Store the address of the new game contract
        _allGames.push(address(game));
        // Update playerToGames mapping for both players
       // _playerToGames[msg.sender].push(address(game));
        _playerToGames[_2ndPlayer].push(address(game));
        // Emit GameCreated event
        emit GameCreated(msg.sender, _2ndPlayer, _1stPlayerCharDeck); 
    }

    function totalGames () external view returns(uint){
        return gameIdCounter;
    }

    // Functions for updating player win/lose counts

    /**
     * @dev Increment the win count for a player.
     * @param _addr The address of the player.
     */
    function addWin(address _addr) external onlyOwners {
        _addressToWinCount[_addr]++;
    }

    /**
     * @dev Increment the lose count for a player.
     * @param _addr The address of the player.
     */
    function addLose(address _addr) external onlyOwners {
        _addressToLoseCount[_addr]++;
    }

    // View functions to retrieve player statistics

    /**
     * @dev Get the win count for a player.
     * @param _addr The address of the player.
     * @return The win count.
     */
    function getWinCount(address _addr) external view returns (uint) {
        return _addressToWinCount[_addr];
    }

    /**
     * @dev Get the lose count for a player.
     * @param _addr The address of the player.
     * @return The lose count.
     */
    function getLoseCount(address _addr) external view returns (uint) {
        return _addressToLoseCount[_addr];
    }

    /**
     * @dev Get the list of game contracts associated with a player.
     * @param _player The address of the player.
     * @return The list of game contracts.
     */
    function getPlayerGames(address _player) external view returns (address[] memory) {
        return _playerToGames[_player];
    }

    /**
     * @dev Get the total number of games.
     * @return The total number of games.
     */
    function getTotalGames() external view returns (uint) {
        return _allGames.length;
    }

    // Owner-only function to set the address of the CharacterCard contract

    /**
     * @dev Set the address of the CharacterCard contract.
     * @param _characterCardAddress The address of the CharacterCard contract.
     */
    function setCharacterCardAddress(address _characterCardAddress) external onlyOwners {
        characterCardAddress = _characterCardAddress;
    }
}
