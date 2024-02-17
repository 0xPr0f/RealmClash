// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title CharacterCardInterface
 * @dev Interface for interacting with the CharacterCard contract.
 */
interface CharacterCardInterface {
    /**
     * @dev Detach a weapon from a character.
     * @param _tokenIdofCharacter The ID of the character token.
     * @param _tokenIdofWeapon The ID of the weapon token.
     * @param _user The address of the user.
     */
    function deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon,
        address _user
    ) external;
}

/**
 * @title RealmClashWeapons
 * @dev ERC721 contract for managing weapons in the Realm Clash game.
 */
contract RealmClashWeapons is ERC721, ERC721Enumerable, ERC721URIStorage {
    uint256 private _tokenIdCounter; // Counter for token IDs
    mapping(address => bool) public _allowedMinters; // Mapping of allowed minters
    address public CharacterCardContract; // Address of the CharacterCard contract

    /**
     * @dev Struct to store weapon card stats.
     */
    struct WeaponCardStats {
        string name; // Name of the weapon
        uint baseHealth; // Base health of the weapon
        uint baseAttack; // Base attack of the weapon
        uint baseMagicPower; // Base magic power of the weapon
        uint baseWeaponSkill; // Base weapon skill of the weapon
        string className; // Class name of the weapon (e.g., sword, staff)
        uint tokenId; // Token ID of the weapon
        uint equippedCharacterId; // ID of the character the weapon is equipped to
    }

    mapping(uint => WeaponCardStats) public weaponStats; // Mapping of weapon stats by token ID

    // Constructor to initialize the contract
    constructor() ERC721("RealmClashWeapons", "RCCW") {
        _allowedMinters[msg.sender] = true; // Allow contract deployer to mint tokens
    }

    /**
     * @dev Modifier to restrict access to minters.
     */
    modifier Minters() {
        require(_allowedMinters[msg.sender], "Not allowed to Mint");
        _;
    }

    /**
     * @dev Mint a new weapon NFT.
     * @param to The address to mint the token to.
     * @param uri The URI for the token metadata.
     * @return The minted token ID.
     */
    function mint(
        address to,
        string memory uri
    ) public Minters returns (uint256) {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, uri);
        return _tokenIdCounter;
    }

    /**
     * @dev Burn a weapon NFT.
     * @param _tokenId The ID of the token to burn.
     * @return The burned token ID.
     */
    function burn(uint256 _tokenId) public Minters returns (uint256) {
        _burn(_tokenId);
        return _tokenId;
    }

    /**
     * @dev Attach weapon stats to a weapon token.
     * @param _tokenId The ID of the weapon token.
     * @param _name The name of the weapon.
     * @param _baseHealth The base health of the weapon.
     * @param _baseAttack The base attack of the weapon.
     * @param _baseMagicPower The base magic power of the weapon.
     * @param _weaponHandling The weapon handling of the weapon.
     * @param _className The class name of the weapon.
     */
    function attachWeaponStats(
        uint _tokenId,
        string calldata _name,
        uint _baseHealth,
        uint _baseAttack,
        uint _baseMagicPower,
        uint _weaponHandling,
        string calldata _className
    ) public Minters {
        weaponStats[_tokenId] = WeaponCardStats(
            _name,
            _baseHealth,
            _baseAttack,
            _baseMagicPower,
            _weaponHandling,
            _className,
            _tokenId,
            0
        );
    }

    /**
     * @dev Detach a weapon from a character.
     * @param _tokenIdofWeapon The ID of the weapon token to detach.
     */
    function detachWeapon(uint _tokenIdofWeapon) public {
        require(
            _isWeaponOwner(_tokenIdofWeapon, msg.sender),
            "Weapon does not belong to you"
        );
        CharacterCardInterface(CharacterCardContract).deatchWeapon(
            0,
            _tokenIdofWeapon,
            msg.sender
        );
    }

    /**
     * @dev Check if the caller is the owner of a weapon.
     * @param _tokenId The ID of the weapon token.
     * @param _addr The address to check ownership against.
     * @return Whether the caller is the owner of the weapon.
     */
    function _isWeaponOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ownerOf(_tokenId) == _addr);
    }

    /**
     * @dev Check if the caller is the owner of a character.
     * @param _tokenId The ID of the character token.
     * @param _addr The address to check ownership against.
     * @return Whether the caller is the owner of the character.
     */
    function _isCharacterOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ERC721(CharacterCardContract).ownerOf(_tokenId) == _addr);
    }

    /**
     * @dev Get the weapon stats for a given token ID.
     * @param _tokenId The ID of the weapon token.
     * @return The weapon stats.
     */
    function _weaponStatsMap(
        uint _tokenId
    ) external view returns (WeaponCardStats memory) {
        return weaponStats[_tokenId];
    }

    /**
     * @dev Set the token URI for a given token ID.
     * @param _tokenId The ID of the token.
     * @param _tokenURI The URI for the token metadata.
     */
    function setTokenURI(
        uint _tokenId,
        string memory _tokenURI
    ) external Minters {
        _setTokenURI(_tokenId, _tokenURI);
    }

    /**
     * @dev Get the token ID of the owner by index.
     * @param owner The address of the token owner.
     * @param index The index of the token.
     * @return The token ID of the owner.
     */
    function _tokenOfOwnerByIndex(
        address owner,
        uint index
    ) external view returns (uint) {
        return tokenOfOwnerByIndex(owner, index);
    }

    /**
     * @dev Get the token ID by index.
     * @param index The index of the token.
     * @return The token ID.
     */
    function _tokenByIndex(uint index) public view returns (uint) {
        return tokenByIndex(index);
    }

    /**
     * @dev Get the owner of the token by index.
     * @param index The index of the token.
     * @return The address of the token owner.
     */
    function _getOwnerByIndex(uint index) public view returns (uint256) {
        // added `return`
        return tokenOfOwnerByIndex(address(msg.sender), index);
    }

    /**
     * @dev Get the owner of the token by index.
     * @param index The index of the token.
     * @return The address of the token owner.
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
    function returnAllOwnerTokenId(
        address _address
    ) external view returns (uint[] memory) {
        uint balance = balanceOf(_address);
        uint[] memory _token = new uint[](balance); // Initialize dynamic array in memory
        for (uint i = 0; i < balance; ++i) {
            _token[i] = tokenOfOwnerByIndex(_address, i);
        }
        return _token;
    }

    /**
     * @dev Override function to update token data.
     * @param to The address to update the token to.
     * @param tokenId The ID of the token to update.
     * @param auth The authorizing address.
     * @return The updated address.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override function to increase token balance.
     * @param account The account to increase balance for.
     * @param value The value to increase balance by.
     */
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override function to return token URI.
     * @param tokenId The ID of the token.
     * @return The token URI.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override function to check supported interfaces.
     * @param interfaceId The interface ID.
     * @return Whether the interface is supported.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Final closing comment for the RealmClashWeapons contract.
     */
}
