// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title Character Card Interface
/// @notice Interface for interacting with the Character Card contract
interface CharacterCardInterface {
    function deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon,
        address _user
    ) external;
    function _isCharacterOwner(
        uint _tokenId,
        address _addr
    ) external view returns (bool);
    function attackStats(uint _tokenId) external view returns (uint);
    function healthStats(uint _tokenId) external view returns (uint);
    function getUlt2(uint _tokenId) external view returns (uint);
    function getUlt3(uint _tokenId) external view returns (uint);
}

/// @title Realm Clash Game Contract
/// @notice Contract for playing a 2-player, 3 vs 3 game
contract Game {
    // Address of the ClashFactory contract
    address public ClashFactory;
    // Address of the CharactersContract
    address public CharactersContract;
    // Array of players
    address[] public players;
    // Mapping of player addresses to their character cards
    mapping(address => uint[]) public playerToCharCards;
    // Mapping of player addresses to their dice rolls
    mapping(address => uint) public playerToDiceRow;
    // Mapping of active characters for each player
    mapping(address => mapping(uint => bool)) public _activeCharacter;
    // Address of the player whose turn it is to play
    address addressToPlay;
    // Address of the player who previously played
    address addressPreviouslyPlayed;
    // Mapping of players to the time remaining for their ultimates
    mapping(address => uint) timeForUlt;
    /// @dev Struct for storing match details
    struct MatchDetails {
        uint gameId; // ID of the game
        uint gameInitiatedTime; // Time the game was initiated
        uint gameAcceptedTime; // Time the game was accepted by the second player
        address[] playersInGame; // Addresses of players in the game
        uint[] characterTokenIdsInGame; // Token IDs of characters in the game
        mapping(address => uint[]) addressToCharacterIdIngame; // Mapping of player addresses to their character token IDs
        bool gameAccepted; // Flag indicating if the game is accepted by the second player
        bool gameStarted; // Flag indicating if the game has started
        address firstInitiatedPlayer; // Address of the player who initiated the game
        address secondInitiatedPlayer; // Address of the second player
        bool gameOver; // Flag indicating if the game is over
        address winner; // Address of the winner of the game
    }
    MatchDetails public matchDetails;

    /// @dev Struct for storing stats of character cards in the game
    struct CharacterCardsInGameStats {
        uint Health; // Health points of the character
        uint Attack; // Attack points of the character
        bool isAlive; // Flag indicating if the character is alive
    }
    mapping(uint => CharacterCardsInGameStats) public characterStatsInGame;

    // Modifier to check if the player owns the specified character cards
    modifier checkPlayerAgainstCards(address _addr) {
        _;
        uint number = playerToCharCards[_addr].length;
        uint[] memory array = playerToCharCards[_addr];
        for (uint i = 0; i < number; ++i) {
            require(
                CharacterCardInterface(CharactersContract)._isCharacterOwner(
                    array[i],
                    _addr
                ),
                "Not yours sadly"
            );
        }
    }

    // Modifier to check if the player is in the game
    modifier playerIsIngame() {
        checkAddressIsInGame();
        _;
    }

    // Modifier to check if the game is over
    modifier GameOver() {
        __beforePlay();
        require(!matchDetails.gameOver, "Game Over");
        _;
    }

    /// @dev Initializes the game with the specified players and character decks
    /// @param _1stPlayer Address of the first player
    /// @param _2ndPlayer Address of the second player
    /// @param _1stPlayerCharDeck Character deck of the first player
    constructor(
        address _1stPlayer,
        address _2ndPlayer,
        uint[] memory _1stPlayerCharDeck,
        address _factory,
        address _characterCards,
        uint _id
    ) checkPlayerAgainstCards(_1stPlayer) {
        require(_1stPlayer != _2ndPlayer && _1stPlayerCharDeck.length == 3);
        playerToCharCards[_1stPlayer] = _1stPlayerCharDeck;
        matchDetails.gameInitiatedTime = block.timestamp;
        matchDetails.playersInGame.push(_1stPlayer);
        matchDetails.playersInGame.push(_2ndPlayer);
        matchDetails.characterTokenIdsInGame = _1stPlayerCharDeck;
        matchDetails.firstInitiatedPlayer = _1stPlayer;
        matchDetails.secondInitiatedPlayer = _2ndPlayer;
        matchDetails.addressToCharacterIdIngame[
            _1stPlayer
        ] = _1stPlayerCharDeck;
        _configureGameFiles(_factory, _characterCards);
        fixAllCharacterAndStats(_1stPlayerCharDeck, _1stPlayer);
        _setGameId(_id);
        require(!matchDetails.gameStarted, "Game has started");
    }

    function _configureGameFiles(
        address _factory,
        address _characterCards
    ) internal {
        ClashFactory = _factory;
        CharactersContract = _characterCards;
    }

    /// @dev Event emitted when a new game is created
    event GameStarted(
        address indexed initiator,
        address indexed game,
        uint indexed gameId
    );
    event GameAccepted(
        address indexed initiator,
        address indexed game,
        uint[] carddeck,
        uint indexed gameId
    );

    /// @dev Function to accept the match initiated by the second player
    /// @param _2ndPlayerCharDeck Character deck of the second player
    function acceptMatch(
        uint[] memory _2ndPlayerCharDeck
    ) external checkPlayerAgainstCards(msg.sender) {
        require(
            matchDetails.gameAcceptedTime == 0 &&
                !(matchDetails.gameAccepted) &&
                msg.sender == matchDetails.secondInitiatedPlayer,
            "Not Allowed"
        );

        for (uint256 i = 0; i < _2ndPlayerCharDeck.length; i++) {
            matchDetails.characterTokenIdsInGame.push(_2ndPlayerCharDeck[i]);
        }
        matchDetails.addressToCharacterIdIngame[
            msg.sender
        ] = _2ndPlayerCharDeck;
        matchDetails.gameAcceptedTime = block.timestamp;
        matchDetails.gameAccepted = true;
        fixAllCharacterAndStats(_2ndPlayerCharDeck, msg.sender);
        emit GameAccepted(
            msg.sender,
            address(this),
            _2ndPlayerCharDeck,
            matchDetails.gameId
        );
    }

    function _setGameId(uint _id) internal {
        matchDetails.gameId = _id;
    }

    /// @dev Function to start the game and roll the dice to determine the player's turn
    function startGameAndRowDice() external {
        require(
            !matchDetails.gameStarted && matchDetails.gameAccepted,
            "Started"
        );

        uint number1 = _generateRandomNumber(
            msg.sender,
            matchDetails.playersInGame
        );
        uint number2 = _generateRandomNumber(
            address(this),
            matchDetails.playersInGame
        );
        playerToDiceRow[matchDetails.firstInitiatedPlayer] = number1;
        playerToDiceRow[matchDetails.secondInitiatedPlayer] = number2;
        (uint firstplayerno, uint secondplayerno) = (
            playerToDiceRow[matchDetails.firstInitiatedPlayer],
            playerToDiceRow[matchDetails.secondInitiatedPlayer]
        );

        __checkBiggerNumber(firstplayerno, secondplayerno)
            ? addressToPlay = matchDetails.firstInitiatedPlayer
            : addressToPlay = matchDetails.secondInitiatedPlayer;
        matchDetails.gameStarted = true;

        emit GameStarted(
            msg.sender,
            matchDetails.secondInitiatedPlayer,
            matchDetails.gameId
        );
    }

    //ATTACK LOGIC AND PATTERNS

    /// @dev Function to use a normal attack with the specified character token ID
    /// @param _tokenId The ID of the character token to use for the attack
    function useNormalAttack(uint _tokenId) external GameOver {
        __checkBeforePlay();
        require(!__checkIfGameLost(msg.sender), "Game over, switch player");

        uint totalDamage = __dishTotalDamage(_tokenId, 1, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(defTokenId), "Defender's character is down");

        __takedamage(totalDamage, defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    /// @dev Function to use an ult2 attack with the specified character token ID
    /// @param _tokenId The ID of the character token to use for the attack
    function useUlt2Attack(uint _tokenId) external GameOver {
        __checkBeforePlay();
        require(!__checkIfGameLost(msg.sender), "Game over, switch player");

        uint totalDamage = __dishTotalDamage(_tokenId, 2, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(defTokenId), "Defender's character is down");

        __takedamage(totalDamage, defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    /// @dev Function to use an ult3 attack with the specified character token ID
    /// @param _tokenId The ID of the character token to use for the attack
    function useUlt3Attack(uint _tokenId) external GameOver {
        __checkBeforePlay();
        require(!__checkIfGameLost(msg.sender), "Game over, switch player");

        uint totalDamage = __dishTotalDamage(_tokenId, 3, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(defTokenId), "Defender's character is down");

        __takedamage(totalDamage, defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    // ACCESS CONTROL AND VALIDATION LOGIC

    /**
     * @dev Overloaded function to check if a specific address is in the game.
     * @param _addr The address to check.
     * @return Whether the address is in the game.
     */
    function checkAddressIsInGame(address _addr) public view returns (bool) {
        return (matchDetails.firstInitiatedPlayer == _addr ||
            matchDetails.secondInitiatedPlayer == _addr);
    }

    /**
     * @dev Check if the game is over and update game state accordingly before a play.
     */
    function __beforePlay() internal {
        matchDetails.gameOver = __checkIfGameLost(msg.sender);
        if (matchDetails.gameOver) {
            matchDetails.winner = __returnOtherValues(
                msg.sender,
                matchDetails.playersInGame
            );
        }
    }

    /**
     * @dev Check conditions before a play.
     */
    function __checkBeforePlay() internal view {
        require(
            isCharacterAlive(getActiveCharacter(msg.sender)),
            "char down, switch"
        );
        require(addressToPlay == msg.sender);
    }

    /**
     * @dev Update game state after a play.
     */
    function __afterPlay() internal {
        addressPreviouslyPlayed = msg.sender;
    }

    /**
     * @dev Check game state after a play.
     */
    function __checkAfterPlay() internal {
        addressPreviouslyPlayed = msg.sender;
    }

    /**
     * @dev Switch player turn.
     * @return nextPlayer The address of the next player.
     */
    function __switchPlayer() internal returns (address nextPlayer) {
        if (matchDetails.firstInitiatedPlayer == addressToPlay) {
            timeForUlt[matchDetails.firstInitiatedPlayer]++;
            addressToPlay = matchDetails.secondInitiatedPlayer;
            nextPlayer = matchDetails.secondInitiatedPlayer;
        } else if (matchDetails.secondInitiatedPlayer == addressToPlay) {
            timeForUlt[matchDetails.secondInitiatedPlayer]++;
            addressToPlay = matchDetails.firstInitiatedPlayer;
            nextPlayer = matchDetails.firstInitiatedPlayer;
        }
        // emit an event
    }

    /**
     * @dev Inflict damage on the defending character.
     * @param _attackingDamage The amount of damage to inflict.
     * @param _defendingTokenId The token ID of the defending character.
     */
    function __takedamage(
        uint _attackingDamage,
        uint _defendingTokenId
    ) internal {
        uint temphealth = characterStatsInGame[_defendingTokenId].Health;
        if (temphealth > _attackingDamage) {
            characterStatsInGame[_defendingTokenId].Health -= _attackingDamage;
        } else if (temphealth <= _attackingDamage) {
            characterStatsInGame[_defendingTokenId].Health = 0;
            characterStatsInGame[_defendingTokenId].isAlive = false;
        }
        // emit an event
    }

    /**
     * @dev Calculate the total damage to be inflicted based on the selected attack type.
     * @param _tokenId The token ID of the attacking character.
     * @param ult The type of attack (1 for normal, 2 for ult2, 3 for ult3).
     * @param _player The address of the attacking player.
     * @return The total damage to be inflicted.
     */
    function __dishTotalDamage(
        uint _tokenId,
        uint ult,
        address _player
    ) internal returns (uint) {
        (, uint _attack, ) = getCharacterInGameStats(_tokenId);
        if (
            ult == 2 &&
            playerToDiceRow[_player] >= 2 &&
            timeForUlt[msg.sender] >= 2
        ) {
            timeForUlt[msg.sender] -= 2;
            playerToDiceRow[_player] = __subtractToZero(
                2,
                playerToDiceRow[_player]
            );
            return
                _attack +
                CharacterCardInterface(CharactersContract).getUlt2(_tokenId);
        } else if (
            ult == 3 &&
            playerToDiceRow[_player] >= 4 &&
            timeForUlt[msg.sender] >= 3
        ) {
            timeForUlt[msg.sender] -= 3;
            playerToDiceRow[_player] = __subtractToZero(
                4,
                playerToDiceRow[_player]
            );
            return
                _attack +
                CharacterCardInterface(CharactersContract).getUlt3(_tokenId);
        } else {
            return _attack + 0;
        }
    }

    /**
     * @dev Get the current health, attack, and status of a character in the game.
     * @param _tokenId The token ID of the character.
     * @return health The current health of the character.
     * @return attack The current attack of the character.
     * @return isAlive The status of the character (true if alive, false if not).
     */
    function getCharacterInGameStats(
        uint _tokenId
    ) public view returns (uint health, uint attack, bool isAlive) {
        CharacterCardsInGameStats memory stats = characterStatsInGame[_tokenId];
        (health, attack, isAlive) = (stats.Health, stats.Attack, stats.isAlive);
    }

    /**
     * @dev Check if a character is still alive.
     * @param _tokenId The token ID of the character.
     * @return true if the character is alive, false otherwise.
     */
    function isCharacterAlive(uint _tokenId) internal view returns (bool) {
        (, , bool __isalive) = getCharacterInGameStats(_tokenId);
        return __isalive;
    }

    /**
     * @dev Initialize character stats for all characters in the game.
     * @param value An array containing the token IDs of the characters.
     */
    function fixAllCharacterAndStats(
        uint[] memory value,
        address _address
    ) public {
        for (uint i = 0; i < value.length; ++i) {
            require(
                CharacterCardInterface(CharactersContract)._isCharacterOwner(
                    value[i],
                    _address
                ),
                "N_O"
            );
            characterStatsInGame[value[i]] = CharacterCardsInGameStats(
                CharacterCardInterface(CharactersContract).healthStats(
                    value[i]
                ),
                CharacterCardInterface(CharactersContract).attackStats(
                    value[i]
                ),
                true
            );
        }
    }

    /**
     * @dev Check if a player has lost the game.
     * @param _addr The address of the player.
     * @return true if the player has lost, false otherwise.
     */
    function __checkIfGameLost(address _addr) internal view returns (bool) {
        uint __deadCount;
        uint number = playerToCharCards[_addr].length;
        uint[] memory array = playerToCharCards[_addr];
        for (uint i = 0; i < number; ++i) {
            if (!isCharacterAlive(array[i])) {
                __deadCount++;
            }
        }
        return __deadCount == number;
    }

    /**
     * @dev Subtract a value from another value and return the result, clamped at zero.
     * @param __value The value to subtract.
     * @param __from The value to subtract from.
     * @return newValue The result of the subtraction.
     */
    function __subtractToZero(
        uint __value,
        uint __from
    ) internal pure returns (uint newValue) {
        if (__from > __value) {
            return __from - __value;
        } else if (__from <= __value) {
            return 0;
        }
    }

    /**
     * @dev Check which player has a bigger dice roll.
     * @param __num1g The first player's dice roll.
     * @param __num2l The second player's dice roll.
     * @return true if the first player's roll is greater, false otherwise.
     */
    function __checkBiggerNumber(
        uint __num1g,
        uint __num2l
    ) internal pure returns (bool) {
        if (__num1g >= __num2l) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Return the address of the other player in the game.
     * @param value The address of the current player.
     * @param values An array containing the addresses of both players.
     * @return The address of the other player.
     */
    function __returnOtherValues(
        address value,
        address[] memory values
    ) internal pure returns (address) {
        for (uint i = 0; i < values.length; i++) {
            if (values[i] == value && i + 1 < values.length) {
                return values[i + 1];
            }
        }
        return address(0);
    }

    /**
     * @dev Retrieve the active character token ID for a player.
     * @param _addr The address of the player.
     * @return x  The token ID of the active character.
     */
    function getActiveCharacter(address _addr) public view returns (uint x) {
        uint[] storage values = matchDetails.addressToCharacterIdIngame[_addr];
        for (uint256 i = 0; i < values.length; i++) {
            if (_activeCharacter[_addr][values[i]] == true) {
                x = values[i];
            }
        }
    }

    /**
     * @dev Set the active character for a player.
     * @param _tokenId The token ID of the character to set as active.
     * @return activeCharacter The token ID of the newly active character.
     */
    function setSwitchActiveCharacter(
        uint _tokenId
    ) external returns (uint activeCharacter) {
        uint[] storage values = matchDetails.addressToCharacterIdIngame[
            msg.sender
        ];
        for (uint256 i = 0; i < values.length; i++) {
            _activeCharacter[msg.sender][values[i]] = false;
        }
        _activeCharacter[msg.sender][_tokenId] = true;
        require(isCharacterAlive(_tokenId));
        activeCharacter = _tokenId;
        __switchPlayer();
        // emit an event
    }

    /**
     * @dev Check if the given address is participating in the game.
     * @return true if the address is in the game, false otherwise.
     */
    function checkAddressIsInGame() public view returns (bool) {
        return (matchDetails.firstInitiatedPlayer == msg.sender ||
            matchDetails.secondInitiatedPlayer == msg.sender);
    }

    /**
     * @dev Check if a player has exactly three character cards.
     * @param _addr The address of the player.
     * @return true if the player has three cards, false otherwise.
     */
    function checkFor3cards(address _addr) public view returns (bool) {
        return playerToCharCards[_addr].length == 3;
    }

    /**
     * @dev Return the other player in the game.
     * @param _returnOpp The address of the current player.
     * @return The address of the other player.
     */
    function returnOtherPlayer(
        address _returnOpp
    ) external view returns (address) {
        return __returnOtherValues(_returnOpp, matchDetails.playersInGame);
    }

    // This isnt the best way to do this, but this is for testing purpose.
    // In the future, this will be changed to use binance oracle
    function _generateRandomNumber(
        address _hash,
        address[] memory values
    ) public view returns (uint256) {
        return
            (uint(
                keccak256(
                    abi.encodePacked(msg.sender, block.timestamp, _hash, values)
                )
            ) % 8) + 8;
    }
}
