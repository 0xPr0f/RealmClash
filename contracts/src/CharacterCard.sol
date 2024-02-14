// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface WeaponCardInterface {
    struct WeaponCardStats {
        string name;
        uint baseHealth; //100 - 200
        uint baseAttack; //10 - 20
        uint baseMagicPower; // 15 - 30
        uint baseWeaponSkill; // 1 - 5
        string className; // sword, staff, bow, spear, grimoire, wand, unidentified
        uint tokenId;
        uint equippedCharacterId;
    }

    function _weaponStatsMap(
        uint _tokenId
    ) external view returns (WeaponCardStats memory);
}

contract RealmClashCharacters is ERC721, ERC721Enumerable, ERC721URIStorage {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public _allowedMinters;
    address public WeaponCardContract;
    address public ArmorCardContract;

    struct CharacterCardStats {
        string name;
        uint baseHealth; //100 - 200
        uint baseAttack; //10 - 20
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

    modifier Minters() {
        require(_allowedMinters[msg.sender], "Not allowed to Mint");
        _;
    }

    function addMinter(address _addr) public Minters {
        _allowedMinters[_addr] = true;
    }

    modifier TokenExist(uint _tokenId) {
        require(_ownerOf(_tokenId) != address(0), "Token doesn't exists.");
        _;
    }

    function mint(
        address to,
        string memory uri
    ) public Minters returns (uint256) {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, uri);
        return _tokenIdCounter;
    }

    function burn(uint256 _tokenId) public Minters returns (uint256) {
        _burn(_tokenId);
        return _tokenId;
    }

    // In game Mechanics
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

    function characterIsUsable(uint _tokenId) public view {
        require(
            characterStats[_tokenId].isUsable,
            "Character is set to not useable"
        );
    }

    function deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon
    ) external {
        _deatchWeapon(_tokenIdofCharacter, _tokenIdofWeapon, msg.sender);
    }

    function deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon,
        address _user
    ) external {
        require(msg.sender == WeaponCardContract, "Not allowed");
        _deatchWeapon(_tokenIdofCharacter, _tokenIdofWeapon, _user);
    }

    function _deatchWeapon(
        uint _tokenIdofCharacter,
        uint _tokenIdofWeapon,
        address _user
    ) internal {
        require(
            _isWeaponOwner(_tokenIdofWeapon, _user) ||
                _isCharacterOwner(_tokenIdofCharacter, _user),
            "does not belong to you"
        );
        characterStats[_tokenIdofCharacter].weaponId = 0;
    }

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
        // also require if the token id of weapon belongs to owner;
        characterStats[_tokenIdofCharacter].weaponId = _tokenIdofWeapon;
    }

    function _isCharacterOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ownerOf(_tokenId) == _addr);
    }

    function _isWeaponOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ERC721(WeaponCardContract).ownerOf(_tokenId) == _addr);
    }

    function _isArmorOwner(
        uint _tokenId,
        address _addr
    ) public view returns (bool) {
        return (ERC721(ArmorCardContract).ownerOf(_tokenId) == _addr);
    }

    function _characterStatsMap(
        uint _tokenId
    ) public view returns (CharacterCardStats memory) {
        return characterStats[_tokenId];
    }

    function healthStats(uint _tokenId) public view returns (uint) {
        return
            (
                (_characterStatsMap(_tokenId).baseHealth +
                    WeaponCardInterface(WeaponCardContract)
                        ._weaponStatsMap(_characterStatsMap(_tokenId).weaponId)
                        .baseHealth)
            ) * 2;
    }

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

    function getUlt2(uint _tokenId) external view returns (uint) {
        return _characterStatsMap(_tokenId).ult2;
    }

    function getUlt3(uint _tokenId) external view returns (uint) {
        return _characterStatsMap(_tokenId).ult3;
    }

    // Updated functions
    
    function setTokenURI (uint _tokenId, string memory _tokenURI ) Minters external {
        _setTokenURI(_tokenId, _tokenURI);
    }

    function _tokenOfOwnerByIndex (address owner, uint index) external view returns (uint) {
       return tokenOfOwnerByIndex(owner, index);
    }
      function _tokenByIndex (uint index) external view returns (uint) {
       return tokenByIndex(index);
    }
    function _getOwnerByIndex(uint index) public view returns (uint256) {
    // added `return`
    return tokenOfOwnerByIndex(address(msg.sender), index);
}
    function getOwnerByIndex(uint256 index) public view returns (address) {
    uint256 tokenId = tokenByIndex(index);
    address owner = ownerOf(tokenId);
    return owner;
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
