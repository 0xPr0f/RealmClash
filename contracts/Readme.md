## Contract section for realmclash

These are the contracts that handle the game mecahnics, verification and access control for the game.

These contracts were rushly written and is written as is

Contract has been documented with natspec for easier understanding.

### Deployment

CharacterCard.sol (`RealmClashCharacters`) -
WeaponCard.sol (`RealmClashWeapons`) -
GameFactory.sol (`RealmFactory`) -
Faucet.sol (`ClashFaucet`) -

Project doesnt currently have a deployment script on foundry, you can use remix to deploy it

src/Game.sol
This is the main contract for all the game functionalities.
some game functionalities include

- checking if card belong to owners
- validating play checks and returning corresponding result
- access control for when to play, what to play and who to play e.t.c

The contract has been fully documented with natspecs to some point.
Any issues or question you have that isnt covered here or want to reach out, for privacy reason, better to create an issue and move from there.
