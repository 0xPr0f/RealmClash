## Realm Clash

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

contracts and webapp

when you clone the project, it create clone two folder
contracts/
webapp/

The contracts is a foundry made project.  
The webapp is made from next js.

To setup the contratcs, `cd ./contracts` the run the foundy install.  
also move out and back to the webapp folder and run the npm install. Rename the `env` to `.env.local` and put your projectId from wallet connect.

To install everything and then start the application, if there are any issues, create an issue on the github and it will be looked at.

This repo contain a POC for an idea i dreamt off.

# TLDR
[how to play game](https://github.com/0xPr0f/realmclash/tree/master/webapp#how-to-play-game)         
[Mechanics of the game](https://github.com/0xPr0f/realmclash/blob/master/contracts/Readme.md#Mechanics)        
[Address Deployments on opBNB](https://github.com/0xPr0f/realmclash/blob/master/contracts/Readme.md#deployment)      

There is currently no demo vid explaning the contracts or game, i feel the project has been well documented, Feel free to request for one, if anything is still unclear (you can create an issue or tg me @profoz)

#### Today functions POC

- Equip weapon
- Game mechanics like battle challenge mode, attack and defend and strategies
- Randomness, minimalist UI
- 3 v 3, 2 player duel mode

#### Soon

- Player lobby system (where players can find a random match up)
- more modes
- On chain store and upgrade to smart contracts
- gas optimaztions and unit computational testing
- Introduction of armor and boosts(spells)
- QOL, better UI and smart contracts

### Project

Realm clash is opensource both the contracts and frontend, the idea is also open for adjustments and evaluation.

images/  
This contains the images of the game (when the `game.sol` contract is been used)

#### Impending doom

Almost hitting API request limit with pinanta which is used to pin the tokenuri (which is currently just the image)

<details>
<summary>RealmClash/contract unasked details</summary>

Contains all the contract that makes this poc function which include natspecs so it can be easier to read through and understand. This contract is built to be fully on chain and the front end is build to access that.

There are still alot of plans and optimaztion for this contract, but current hinderance in the 3 days of bulding this contract are.

- Stack too deep on `contract/CharacterCard.sol` when attaching stats, tried using arrays in the argument and indexing it to fill the struct, no avail
- Redundant for loops, for loops are know for consuming gas, assembly could have been used, but for the sake for this POC it wasnt
- No use of libraries
</details>

<details>
<summary>RealmClash/webapp unasked details</summary>

Contains the nextjs front end for the contracts, it is fairly minimalist and probably not appealing, i am not too good with UI and colors

Hinderance in webapp

- wagmi and viem 2.x contributed in psychological trauma.
- probably color blind or terrible taste in color and not that great at UI
</details>
