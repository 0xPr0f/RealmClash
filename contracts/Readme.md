## Contract section for realmclash

These are the contracts that handle the game mecahnics, verification and access control for the game.

These contracts were rushly written and is written as is

Contract has been documented with natspec for easier understanding.

### Deployment

CharacterCard.sol (`RealmClashCharacters`) - 0xF2ac4229724b6da9d1856BDfb1492Cb9b79C7156  
WeaponCard.sol (`RealmClashWeapons`) - 0xeb930EeA29cbABe8742C951eeFF7E833Ab2c867E  
GameFactory.sol (`RealmFactory`) - 0x7e514cCd18ec5Ba6CE8ce98b336349a0cBBb4B0b  
Faucet.sol (`ClashFaucet`) - 0xBeE1de59bf3EB1EABDEb1244CEdf98AC0c91de58

Project doesnt currently have a deployment script on foundry, you can use remix to deploy it

src/Game.sol
This is the main contract for all the game functionalities.
some game functionalities include

- checking if card belong to owners
- validating play checks and returning corresponding result
- access control for when to play, what to play and who to play e.t.c

The contract has been fully documented with natspecs to some point.
Any issues or question you have that isnt covered here or want to reach out, for privacy reason, better to create an issue and move from there.

### Mechanics

If you are interested in the project, you would most likely be looking at `src/Game.sol` it is where the core functionalites of the game is, it is detailed with natspecs to explain what some of the function does.

Something to note, when using ultimate 2 and ultimate 3, if you do not have sufficient power point or Ultimate rounds, the code is written for the function not to fail but instead skip and deliver that of a normal attack with no multipliers.

functions to looks at in `src/Game.sol`

- `acceptMatch` : accepts the match proposed and roll dice for both players.
- `startGameAndRowDice` : called by `acceptMatch` and it is what determines who to play first based on dice value(power point)
- `__dishTotalDamage` : determines and return the attack value to use by a player with a specific character
- `__takedamage` : safely subtract the incoming damage
- `setSwitchActiveCharacter` : switch character

This is just a small list of what to looks at if you are wondering about mechanics or are trying to contribute and turn some of the internal redundancies into a library lmao.

#### Upgrades

With the way it is layed out, when new functions have been rolled out to a contract in `src/`, only that contract will need a redeployment i think.
