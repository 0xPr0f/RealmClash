// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CharacterCard {
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
    ) external;

    function mint(address to, string memory uri) external returns (uint256);
}

interface WeaponCard {
    function attachWeaponStats(
        uint _tokenId,
        string calldata _name,
        uint _baseHealth,
        uint _baseAttack,
        uint _baseMagicPower,
        uint _weaponHandling,
        string calldata _className
    ) external;

    function mint(address to, string memory uri) external returns (uint256);
}

contract ClashFaucet {
    // Address of the CharacterCard contract
    address public characterCardAddress;
    // Address of the WeaponCard contract
    address public weaponCardAddress;
    // Hard coded URI for Knight
    string public KnightURI = "";
    // Hard coded URI for Archer
    string public ArcherURI = "";
    // Hard coded URI for Hop Goblin
    string public HopGoblinURI = "";
    // Hard coded URI for Knight
    string public SwordURI = "";
    // Hard coded URI for Archer
    string public BowURI = "";
    // Hard coded URI for Hop Goblin
    string public MachetURI = "";
    // Mapping to track allowed contract owners
    mapping(address => bool) private _allowedOwners;
    function mintAndaddCharacterAttributes(address _address) external {
        uint tokenId1 = CharacterCard(characterCardAddress).mint(
            _address,
            KnightURI
        );

        CharacterCard(characterCardAddress).attachCharacterStats(
            tokenId1,
            "Guardian Knight of Contract",
            genR(_address, 150, 220),
            genR(_address, 14, 30),
            genR(_address, 8, 17),
            genR(_address, 1, 4),
            "Knight",
            genR(_address, 10, 20),
            genR(_address, 20, 40)
        );

        uint tokenId2 = CharacterCard(characterCardAddress).mint(
            _address,
            ArcherURI
        );

        CharacterCard(characterCardAddress).attachCharacterStats(
            tokenId2,
            "Archer Queen",
            genR(_address, 120, 150),
            genR(_address, 25, 45),
            genR(_address, 10, 20),
            genR(_address, 2, 4),
            "Archer",
            genR(_address, 13, 20),
            genR(_address, 25, 40)
        );

        uint tokenId3 = CharacterCard(characterCardAddress).mint(
            _address,
            HopGoblinURI
        );

        CharacterCard(characterCardAddress).attachCharacterStats(
            tokenId3,
            "Goblin of Doom",
            genR(_address, 200, 300),
            genR(_address, 5, 15),
            genR(_address, 5, 15),
            genR(_address, 1, 3),
            "Monster King",
            genR(_address, 10, 20),
            genR(_address, 20, 40)
        );
        mintAndaddWeaponAttributes(_address);
    }

    function mintAndaddWeaponAttributes(address _address) public {
        uint tokenId1 = WeaponCard(weaponCardAddress).mint(_address, SwordURI);

        WeaponCard(weaponCardAddress).attachWeaponStats(
            tokenId1,
            "Sword Vanquisher",
            genR(_address, 15, 22),
            genR(_address, 14, 25),
            genR(_address, 8, 17),
            genR(_address, 1, 4),
            "Sword"
        );

        uint tokenId2 = WeaponCard(weaponCardAddress).mint(_address, BowURI);
        WeaponCard(weaponCardAddress).attachWeaponStats(
            tokenId2,
            "Tricksy Target",
            genR(_address, 12, 15),
            genR(_address, 20, 30),
            genR(_address, 10, 20),
            genR(_address, 2, 4),
            "Bow"
        );

        uint tokenId3 = WeaponCard(weaponCardAddress).mint(_address, MachetURI);
        WeaponCard(weaponCardAddress).attachWeaponStats(
            tokenId3,
            "Toxic Machete",
            genR(_address, 20, 30),
            genR(_address, 5, 10),
            genR(_address, 5, 10),
            genR(_address, 1, 3),
            "Machet"
        );
    }

    function setKnightURI(string calldata _str) external {
        KnightURI = _str;
    }
    function setArcherURI(string calldata _str) external {
        ArcherURI = _str;
    }
    function setGoblinURI(string calldata _str) external {
        HopGoblinURI = _str;
    }
    function setSwordURI(string calldata _str) external {
        SwordURI = _str;
    }
    function setBowURI(string calldata _str) external {
        BowURI = _str;
    }
    function setMachetURI(string calldata _str) external {
        MachetURI = _str;
    }

    modifier onlyOwners() {
        require(_allowedOwners[msg.sender], "Not allowed");
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
     * @dev Set the address of the CharacterCard contract.
     * @param _characterCardAddress The address of the CharacterCard contract.
     */
    function setCharacterCardAddress(
        address _characterCardAddress
    ) external onlyOwners {
        characterCardAddress = _characterCardAddress;
    }
    function setWeaponCardAddress(
        address _weaponCardAddress
    ) external onlyOwners {
        weaponCardAddress = _weaponCardAddress;
    }

    function genR(
        address _hash,
        uint _minInclusive,
        uint _maxExclusive
    ) internal view returns (uint) {
        uint[] memory values = new uint[](2);
        values[0] = block.timestamp;
        values[1] = block.number;
        return
            _generateRandomNumber(_hash, values, _minInclusive, _maxExclusive);
    }

    // This isnt the best way to do this, but this is for testing purpose.
    // In the future, this will be changed to use binance oracle
    function _generateRandomNumber(
        address _hash,
        uint[] memory values,
        uint _minInclusive,
        uint _maxExclusive
    ) internal view returns (uint256) {
        uint testnumb = _maxExclusive - _minInclusive;
        return
            (uint(
                keccak256(
                    abi.encodePacked(
                        msg.sender,
                        block.timestamp,
                        _hash,
                        values,
                        _minInclusive + _maxExclusive
                    )
                )
            ) % testnumb) + _minInclusive;
    }
}
