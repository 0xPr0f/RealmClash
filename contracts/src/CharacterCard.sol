// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title Weapon Card Interface
 * @dev Interface for interacting with Weapon Card NFTs
 */
interface WeaponCardInterface {
    struct WeaponCardStats {
        string name;
        uint baseHealth; // 100 - 200
        uint baseAttack; // 10 - 20
        uint baseMagicPower; // 15 - 30
        uint baseWeaponSkill; // 1 - 5
        string className; // sword, staff, bow, spear, grimoire, wand, unidentified
        uint tokenId;
        uint equippedCharacterId;
    }

    function _weaponStatsMap(uint _tokenId) external view returns (WeaponCardStats memory);
}

/**
 * @title Realm Clash Characters Contract
 * @dev This contract manages the creation and functionalities of character cards in the Realm Clash game.
 */
contract RealmClashCharacters is ERC721, ERC721Enumerable, ERC721URIStorage {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public _allowedMinters;
    address public WeaponCardContract;
    address public ArmorCardContract;

    struct CharacterCardStats {
        string name;
        uint baseHealth; // 100 - 200
        uint baseAttack; // 10 - 20
        uint baseMagicPower; // 15 - 30
        uint baseSkillMultipier; // 1 - 5
        string className; // King, Mage, Archer, Knight, Demon, God, Human
        bool isUsable; // true, false
        uint tokenId;
        uint weaponId;
        uint armorId;
        uint ult2;
        uint ult3;
    }

    mapping(uint => CharacterCardStats) public characterStats;

    constructor() ERC721("RealmClashCharacters", "RCCC") {
        _allowedMinters[msg.sender] = true;
    }

    /**
     * @dev Modifier to restrict minting to authorized addresses.
     */
    modifier Minters() {
        require(_allowedMinters[msg.sender], "Not allowed to Mint");
        _;
    }

    /**
     * @dev Function to add a new minter.
     * @param _addr Address of the minter to be added.
     */
    function addMinter(address _addr) public Minters {
        _allowedMinters[_addr] = true;
    }

    /**
     * @dev Modifier to check if a token exists.
     * @param _tokenId ID of the token to be checked.
     */
    modifier TokenExist(uint _tokenId) {
        require(_ownerOf(_tokenId) != address(0), "Token doesn't exists.");
        _;
    }

    /**
     * @dev Function to mint a new character card.
     * @param to Address to mint the character card to.
     * @param uri URI of the character card.
     * @return The ID of the minted character card.
     */
    function mint(address to, string memory uri) public Minters returns (uint256) {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, uri);
        return _tokenIdCounter;
    }

    /**
     * @dev Function to burn a character card.
     * @param _tokenId ID of the character card to be burned.
     * @return The ID of the burned character card.
     */
    function burn(uint256 _tokenId) public Minters returns (uint256) {
        _burn(_tokenId);
        return _tokenId;
    }

    /**
     * @dev Function to attach statistics to a character card.
     * @param _tokenId ID of the character card.
     * @param _name Name of the character.
     * @param _baseHealth Base health points of the character.
     * @param _baseAttack Base attack points of the character.
     * @param _baseMagicPower Base magic power of the character.
     * @param _baseSkillMultipier Base skill multiplier of the character.
     * @param _className Class name of the character.
     * @param _ult2 ID of the second ultimate ability.
     * @param _ult3 ID of the third ultimate ability.
     */
    function attachCharacterStats(
        uint _tokenId,
        string calldata _name,
        uint _baseHealth,
        uint _baseAttack,
        uint _baseMagicPower,
        uint _baseSkillMultipier,
        string calldata _className,
        uint _ult2,
        uint _ult3
    ) public Minters {
        characterStats[_tokenId] = CharacterCardStats(
            _name,
            _baseHealth,
            _baseAttack,
            _baseMagicPower,
            _baseSkillMultipier,
            _className,
            true,
            _tokenId,
            0,
            0,
            _ult2,
            _ult3
        );
    }

    /**
     * @dev Function to check if a character card is usable.
     * @param _tokenId ID of the character card to be checked.
     */
    function characterIsUsable(uint _tokenId) public view {
        require(characterStats[_tokenId].isUsable, "Character is set to not usable");
    }

    /**
     * @dev Function to detach a weapon from a character card.
     * @param _tokenIdofCharacter ID of the character card.
     * @param _tokenIdofWeapon ID of the weapon card.
     */
    function detachWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon
    ) external {
        _deatchWeapon(_tokenIdofCharacter, _tokenIdofWeapon, msg.sender);
    }

    /**
     * @dev Internal function to detach a weapon from a character card.
     * @param _tokenIdofCharacter ID of the character card.
     * @param _tokenIdofWeapon ID of the weapon card.
     * @param _user Address of the user performing the action.
     */
    function _deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon,
        address _user
    ) internal {
        require(
            _isWeaponOwner(_tokenIdofWeapon, _user) ||
                _isCharacterOwner(_tokenIdofCharacter, _user),
            "Does not belong to you"
        );
        characterStats[_tokenIdofCharacter].weaponId = 0;
    }

    /**
     * @dev Function to equip a weapon to a character card.
     * @param _tokenIdofCharacter ID of the character card.
     * @param _tokenIdofWeapon ID of the weapon card.
     */
    function equipWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon
    ) external {
        require(
            _isCharacterOwner(_tokenIdofCharacter, msg.sender),
            "Character does not belong to you"
        );
        require(
            _isWeaponOwner(_tokenIdofCharacter, msg.sender),
            "Weapon does not belong to you"
        );
        characterStats[_tokenIdofCharacter].weaponId = _tokenIdofWeapon;
    }

    /**
     * @dev Function to check if an address is the owner of a
character card.
* @param _tokenId ID of the character card.
* @param _addr Address to be checked.
* @return A boolean indicating whether the address is the owner of the character card.
*/
    function _isCharacterOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ownerOf(_tokenId) == _addr);
    }

    /**
     * @dev Function to check if an address is the owner of a
weapon card.
* @param _tokenId ID of the weapon card.
* @param _addr Address to be checked.
* @return A boolean indicating whether the address is the owner of the weapon card.
*/
function _isWeaponOwner(
uint _tokenId,
address _addr
) public view returns (bool) {
return (ERC721(WeaponCardContract).ownerOf(_tokenId) == _addr);
}
/**
 * @dev Function to check if an address is the owner of an armor card.
 * @param _tokenId ID of the armor card.
 * @param _addr Address to be checked.
 * @return A boolean indicating whether the address is the owner of the armor card.
 */
function _isArmorOwner(
    uint _tokenId,
    address _addr
) public view returns (bool) {
    return (ERC721(ArmorCardContract).ownerOf(_tokenId) == _addr);
}

/**
 * @dev Function to get the statistics of a character card.
 * @param _tokenId ID of the character card.
 * @return The statistics of the character card.
 */
function _characterStatsMap(
    uint _tokenId
) public view returns (CharacterCardStats memory) {
    return characterStats[_tokenId];
}

/**
 * @dev Function to get the health statistics of a character card.
 * @param _tokenId ID of the character card.
 * @return The health statistics of the character card.
 */
function healthStats(uint _tokenId) public view returns (uint) {
    return
        (
            (_characterStatsMap(_tokenId).baseHealth +
                WeaponCardInterface(WeaponCardContract)
                    ._weaponStatsMap(_characterStatsMap(_tokenId).weaponId)
                    .baseHealth)
        ) * 2;
}

/**
 * @dev Function to get the attack statistics of a character card.
 * @param _tokenId ID of the character card.
 * @return The attack statistics of the character card.
 */
function attackStats(uint _tokenId) external view returns (uint) {
    return (((_characterStatsMap(_tokenId).baseAttack +
        (_characterStatsMap(_tokenId).baseMagicPower)) *
        (_characterStatsMap(_tokenId).baseSkillMultipier)) +
        (
            (
                WeaponCardInterface(WeaponCardContract)
                    ._weaponStatsMap(_characterStatsMap(_tokenId).weaponId)
                    .baseAttack
            )
        ) +
        (
            WeaponCardInterface(WeaponCardContract)
                ._weaponStatsMap(_characterStatsMap(_tokenId).weaponId)
                .baseMagicPower
        ) *
        WeaponCardInterface(WeaponCardContract)
            ._weaponStatsMap(_characterStatsMap(_tokenId).weaponId)
            .baseWeaponSkill);
}

/**
 * @dev Function to get the ID of the second ultimate ability of a character card.
 * @param _tokenId ID of the character card.
 * @return The ID of the second ultimate ability.
 */
function getUlt2(uint _tokenId) external view returns (uint) {
    return _characterStatsMap(_tokenId).ult2;
}

/**
 * @dev Function to get the ID of the third ultimate ability of a character card.
 * @param _tokenId ID of the character card.
 * @return The ID of the third ultimate ability.
 */
function getUlt3(uint _tokenId) external view returns (uint) {
    return _characterStatsMap(_tokenId).ult3;
}

// Updated functions

/**
 * @dev Function to set the token URI.
 * @param _tokenId ID of the token.
 * @param _tokenURI URI of the token.
 */
function setTokenURI (uint _tokenId, string memory _tokenURI ) Minters external {
    _setTokenURI(_tokenId, _tokenURI);
}

/**
 * @dev Function to get the token ID of an owner by index.
 * @param owner Address of the owner.
 * @param index Index of the token.
 * @return The token ID.
 */
function _tokenOfOwnerByIndex (address owner, uint index) external view returns (uint) {
   return tokenOfOwnerByIndex(owner, index);
}

/**
 * @dev Function to get the token ID by index.
 * @param index Index of the token.
 * @return The token ID.
 */
function _tokenByIndex (uint index) public view returns (uint) {
   return tokenByIndex(index);
}

/**
 * @dev Function to get the owner of a token by index.
 * @param index Index of the token.
 * @return The owner address.
 */
function _getOwnerByIndex(uint index) public view returns (uint256) {
    return tokenOfOwnerByIndex(address(msg.sender), index);
}

/**
 * @dev Function to get the owner of a token by index.
 * @param index Index of the token.
 * @return The owner address.
 */
function getOwnerByIndex(uint256 index) public view returns (address) {
    uint256 tokenId = tokenByIndex(index);
    address owner = ownerOf(tokenId);
    return owner;
}

/**
 * @dev Function to return all token IDs owned by an address.
 * @param _address Address of the owner.
 * @return An array containing all token IDs owned by the address.
 */
function returnAllOwnerTokenId(address _address) external view returns (uint[] memory) {
    uint balance = balanceOf(_address);
    uint[] memory _token = new uint[](balance); // Initialize dynamic array in memory
    for(uint i = 0; i < balance; ++i ){
        _token[i] = _tokenByIndex(i);
    }
    return _token;
}

// The following functions are overrides required by Solidity.

function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable)
    returns (address)
{
    return super._update(to, tokenId, auth);
}

function _increaseBalance(address account, uint128 value)
    internal
    override(ERC721, ERC721Enumerable)
{
    super._increaseBalance(account, value);
}

function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
}

function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}
}
