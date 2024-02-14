// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

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

// logic to play a game.
// NOTE: We currently support a 2 player,  3 vs 3 game
contract Game {
    address public ClashFactory;
    address public RealmClashCharactersContract;
    address[] public players;
    mapping(address => uint[]) public playerToCharCards;
    mapping(address => uint) public playerToDiceRow;
    mapping(address => mapping(uint => bool)) public _activeCharacter;
    address addressToPlay;
    address addressPreviouslyPlayed;
    mapping(address => uint) timeForUlt;
    CharacterCardInterface public CharCardInterface =
        CharacterCardInterface(RealmClashCharactersContract);

    struct MatchDetails {
        uint gameId; // id of the game, gotten from most likely the factory
        uint gameInitiatedTime; // the time the game was requested or created
        uint gameAcceptedTime; // the time the second player accepted the game
        address[] playersInGame; // the address of players in the game, it should be only 2
        uint[] characterTokenIdsInGame; // the total number of NFT in the game, should be only 6, the first three belong to player 1 and the later 3 belongs to player 2
        mapping(address => uint[]) addressToCharacterIdIngame; // the NFT belonging to the address in the game
        bool gameAccepted; // if 2nd player has accepted it
        bool gameStarted; // game is started is true when the dice is rolled, the higher dice number goes first
        address firstInitiatedPlayer;
        address secondInitiatedPlayer;
        bool gameOver;
        address winner;
    }
    MatchDetails public matchDetails;

    struct CharacterCardsInGameStats {
        uint Health;
        uint Attack;
        bool isAlive;
    }
    mapping(uint => CharacterCardsInGameStats) public characterStatsInGame;

    modifier checkPlayerAgainstCards(address _addr) {
        _;
        uint number = playerToCharCards[_addr].length;
        uint[] memory array = playerToCharCards[_addr];
        for (uint i = 0; i < number; ++i) {
            require(
                CharacterCardInterface(RealmClashCharactersContract)
                    ._isCharacterOwner(array[i], _addr),
                "Not yours sadly"
            );
        }
    }

    modifier playerIsIngame() {
        checkAddressIsInGame();
        _;
    }
    modifier GameOver() {
        __beforePlay();
        require(!matchDetails.gameOver, "G_O");
        _;
    }

    constructor(
        address _1stPlayer,
        address _2ndPlayer,
        uint[] memory _1stPlayerCharDeck
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
        fixAllCharacterAndStats(_1stPlayerCharDeck);
        require(!matchDetails.gameStarted, "Game hasStarted");

        // emit an event
    }

    function acceptMatch(
        uint[] memory _2ndPlayerCharDeck
    ) external checkPlayerAgainstCards(msg.sender) {
        require(
            matchDetails.gameAcceptedTime == 0 &&
                !matchDetails.gameAccepted &&
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
        fixAllCharacterAndStats(_2ndPlayerCharDeck);
        // emit and event
    }

    function startGameAndRowDice() external {
        require(!matchDetails.gameStarted, "Started");
        // get the two players a random number and display it, the higher number goes first;
        uint number1 = _generateRandomNumber(msg.sender, matchDetails.playersInGame); 
        uint number2 = _generateRandomNumber(address(this), matchDetails.playersInGame); 
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

        // emit and event
    }

    //ATTACK LOGIC AND PATTERNS

    // ult 1 for normal attacks

    function useNormalAttack(uint _tokenId) external GameOver {
        __checkBeforePlay();
        require(__checkIfGameLost(msg.sender) == false);
        uint _totalDamage = __dishTotalDamage(_tokenId, 1, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint _defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(_defTokenId));
        __takedamage(_totalDamage, _defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    // ult 2 for normal attacks
    function useUlt2Attack(uint _tokenId) external GameOver {
        // __beforePlay();
        __checkBeforePlay();
        require(__checkIfGameLost(msg.sender) == false);
        uint _totalDamage = __dishTotalDamage(_tokenId, 2, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint _defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(_defTokenId));
        __takedamage(_totalDamage, _defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    // ult 3 for normal attacks
    function useUlt3Attack(uint _tokenId) external GameOver {
        // __beforePlay();
        __checkBeforePlay();
        require(__checkIfGameLost(msg.sender) == false);
        uint _totalDamage = __dishTotalDamage(_tokenId, 3, msg.sender);
        address def = __returnOtherValues(
            addressToPlay,
            matchDetails.playersInGame
        );
        uint _defTokenId = getActiveCharacter(def);
        require(isCharacterAlive(_defTokenId));
        __takedamage(_totalDamage, _defTokenId);
        __switchPlayer();
        __checkAfterPlay();
    }

    // ACCESS CONTROL AND VALIDATION LOGIC
    function checkFor3cards(address _addr) public view returns (bool) {
        return playerToCharCards[_addr].length == 3;
    }

    function checkAddressIsInGame() public view returns (bool) {
        return (matchDetails.firstInitiatedPlayer == msg.sender ||
            matchDetails.secondInitiatedPlayer == msg.sender);
    }

    function getActiveCharacter(address _addr) internal view returns (uint x) {
        uint[] storage values = matchDetails.addressToCharacterIdIngame[_addr];
        for (uint256 i = 0; i < values.length; i++) {
            if (_activeCharacter[_addr][values[i]] == true) {
                x = values[i];
            }
        }
    }

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
        //probably also emit an event
    }

    function played() public playerIsIngame {}

    function __beforePlay() internal {
        matchDetails.gameOver = __checkIfGameLost(msg.sender);
        if (matchDetails.gameOver) {
            matchDetails.winner = __returnOtherValues(
                msg.sender,
                matchDetails.playersInGame
            );
        }
    }

    function __checkBeforePlay() internal view {
        require(
            isCharacterAlive(getActiveCharacter(msg.sender)),
            "char down, switch"
        );
        require(addressToPlay == msg.sender);
    }

    function __afterPlay() internal {
        addressPreviouslyPlayed = msg.sender;
    }

    function __checkAfterPlay() internal {
        addressPreviouslyPlayed = msg.sender;
    }

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
    }

    function __takedamage(
        uint _attackingDamage,
        uint _defendingTokenId
    ) internal {
        /* (uint attkhealth,uint attkattack) = getCharacterInGameStats(_attackingTokenId);
        (uint defhealth,uint defattack) = getCharacterInGameStats(_defendingTokenId);
*/ // require (characterStatsInGame[_defendingTokenId].isAlive != false, "char is down");
        uint temphealth = characterStatsInGame[_defendingTokenId].Health;
        if (temphealth > _attackingDamage) {
            characterStatsInGame[_defendingTokenId].Health -= _attackingDamage;
        } else if (temphealth <= _attackingDamage) {
            characterStatsInGame[_defendingTokenId].Health = 0;
            characterStatsInGame[_defendingTokenId].isAlive = false;
        }

        // emit an event
    }

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
            return _attack + CharCardInterface.getUlt2(_tokenId);
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
            return _attack + CharCardInterface.getUlt3(_tokenId);
        } else {
            return _attack + 0;
        }
    }

    function getCharacterInGameStats(
        uint _tokenId
    ) internal view returns (uint health, uint attack, bool isAlive) {
        CharacterCardsInGameStats memory stats = characterStatsInGame[_tokenId];
        (health, attack, isAlive) = (stats.Health, stats.Attack, stats.isAlive);
    }

    function isCharacterAlive(uint _tokenId) internal view returns (bool) {
        (, , bool __isalive) = getCharacterInGameStats(_tokenId);
        return __isalive;
    }

    function fixAllCharacterAndStats(uint[] memory value) internal {
        for (uint i = 0; i < value.length; ++i) {
            require(CharCardInterface._isCharacterOwner(value[i], msg.sender));
            characterStatsInGame[value[i]] = CharacterCardsInGameStats(
                CharCardInterface.healthStats(value[i]),
                CharCardInterface.attackStats(value[i]),
                true
            );
        }
    }

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

    // This isnt the best way to do this, but this is for testing purpose.
    // In the future, this will be changed to use binance oracle
  function _generateRandomNumber(address _hash, address [] memory values) public view returns (uint256) {
        return uint (keccak256(abi.encodePacked (msg.sender, block.timestamp,_hash, values ))) % 8 + 8;
    }
}
