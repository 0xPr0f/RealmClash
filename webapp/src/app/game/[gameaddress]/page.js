'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './game.css'
import CardBox, { CardBoxGame } from '@/app/components/cardBox/cardBox'
import BoxButton from '@/app/components/boxButton/boxButton'
import { useReadContract, useAccount, useWriteContract } from 'wagmi'
import { GAME_ABI } from '@/app/ABI'
import Tooltip from '@/app/components/toolTip/toolTip'
import EmptyView from '@/app/components/emptyView/emptyView'
import { GiCrossedSwords, GiSwordWound, GiPointySword } from 'react-icons/gi'
import { FaRotate, FaArrowsRotate } from 'react-icons/fa6'
import { opBNBTestnet } from 'viem/chains'
import { ConnectorNotConnectedError } from 'wagmi'
import { config } from '@/app/Interloop'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'

export default function GameRoom({ params }) {
  const router = useRouter()
  const account = useAccount()
  const { address } = useAccount()
  //const { writeContract } = useWriteContract();
  const [selectedCard, setSelectedCard] = useState(null)
  const [allYourCardsInGame, setAllYourCardsInGame] = useState()
  const [allOppositeCardsInGame, setAllOppositeCardsInGame] = useState()
  const [oppositePlayerAddress, setOppositePlayerAddress] = useState()

  const handleCardClick = (index) => {
    setSelectedCard((prevSelectedCard) => {
      return prevSelectedCard === index ? null : index
    })
  }
  const matchDetails = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'matchDetails',
    config: config,
    account: account,
    chainId: opBNBTestnet.id,
  })
  const activeCharacter = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'getActiveCharacter',
    args: [address],
    account: account,
    config: config,
    account: account,
    chainId: opBNBTestnet.id,
  })
  const charactersTokenIdsY = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'returnAddressToCharacterIdIngame',
    args: [address],
    config: config,
    account: account,
    chainId: opBNBTestnet.id,
  })
  const charactersTokenIdsO = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'returnAddressToCharacterIdIngame',
    args: [oppositePlayerAddress],
    config: config,
    account: account,
    chainId: opBNBTestnet.id,
  })
  const returnOtherAddress = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'returnOtherPlayer',
    args: [address],
    account: account,
    config: config,
    account: account,
    chainId: opBNBTestnet.id,
  })
  const isAddressInGame = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'checkAddressIsInGame',
    account: account,
    config: config,
    chainId: opBNBTestnet.id,
  })
  const powerPointCount = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'playerToDiceRow',
    account: account,
    config: config,
    chainId: opBNBTestnet.id,
  })
  const timeToULTCount = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'timeForUlt',
    args: [account],
    account: account,
    config: config,
    chainId: opBNBTestnet.id,
  })
  const addressToPlay = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'addressToPlay',
    args: [address],
    account: account,
    config: config,
    chainId: opBNBTestnet.id,
  })
  /*
  const getCharacterStats = async (tokenId) => {
    try {
      const result = await readContract(config, {
        abi: GAME_ABI,
        address: params.gameaddress,
        functionName: "getCharacterInGameStats",
        args: [BigInt(tokenId)],
        account: account,
        chainId: opBNBTestnet.id,
      });
      return result;
    } catch (error) {
      return "lottts of errorss";
    }
  }; */
  const useNormalAttack = async (tokenId) => {
    await writeContract(config, {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'useNormalAttack',
      args: [BigInt(tokenId)],
      account: account,
    })
    console.log(selectedCard)
  }
  const useULT2Attack = async (tokenId) => {
    await writeContract(config, {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'useUlt2Attack',
      args: [BigInt(tokenId)],
      account: account,
    })
    console.log(selectedCard)
  }
  const useULT3Attack = async (tokenId) => {
    await writeContract(config, {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'useUlt3Attack',
      args: [BigInt(tokenId)],
      account: account,
    })
    console.log(selectedCard)
  }
  const switchCharacter = async (tokenId) => {
    await writeContract(config, {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'setSwitchActiveCharacter',
      args: [BigInt(tokenId)],
      account: account,
    })
    console.log(selectedCard)
  }
  useEffect(() => {
    setOppositePlayerAddress(returnOtherAddress.data)
    setAllYourCardsInGame(charactersTokenIdsY.data)

    setAllOppositeCardsInGame(charactersTokenIdsO.data)
  }, [charactersTokenIdsY, returnOtherAddress])

  const sendRequest = async (tokenId) => {
    const request = writeContract(config, {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'createNewGameManual',
      args: [challengee, selectedCards],
      chainId: opBNBTestnet.id,
      account: address,
    })
    console.log(await request)
  }

  return (
    <div>
      <div style={{ padding: '20px' }}>
        address : {JSON.stringify(params.gameaddress)}
      </div>
      {params.gameaddress.length === 42 ? (
        <div>
          <div className="game-board">
            <div className="cards-up">
              {allOppositeCardsInGame ||
                [1, 2, 3]?.map((cardId) => (
                  <CardBoxGame key={cardId}>
                    Card {cardId.toString()}
                  </CardBoxGame>
                ))}
            </div>
            <div className="cardsdown">
              <div className="buttons">
                <BoxButton
                  outsidePadding="20px"
                  borderRadius="100%"
                  height="40px"
                  width="40px"
                  onClick={() => {
                    switchCharacter()
                  }}
                >
                  <FaArrowsRotate size={20} fontWeight={1} />
                </BoxButton>
              </div>
              <div className="cards-down">
                {allYourCardsInGame?.map((cardId) => (
                  <CardBoxGame
                    gameaddress={params.gameaddress}
                    tokenId={cardId}
                    key={cardId}
                    className={`card ${
                      selectedCard === Number(cardId) ? 'selected' : ''
                    }`}
                    onClick={() => handleCardClick(Number(cardId))}
                  >
                    Card {cardId.toString()}
                  </CardBoxGame>
                ))}
              </div>
              {/*You will have to be connected to be able to see the buttons to do stuff*/}
              <div className="theAttackButtons">
                <div className="buttons">
                  <BoxButton
                    outsidePadding="20px"
                    borderRadius="100%"
                    height="80px"
                    width="80px"
                    onClick={async () => {
                      useNormalAttack(selectedCard)
                    }}
                  >
                    <GiCrossedSwords size={43} />
                  </BoxButton>
                  <BoxButton
                    borderRadius="100%"
                    height="68px"
                    width="68px"
                    onClick={() => {
                      useULT2Attack(selectedCard)
                    }}
                  >
                    <GiSwordWound size={40} />
                  </BoxButton>
                  <BoxButton
                    outsidePadding="20px"
                    borderRadius="100%"
                    height="60px"
                    width="60px"
                    onClick={() => {
                      useULT3Attack(selectedCard)
                    }}
                  >
                    <GiPointySword size={40} />
                  </BoxButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EmptyView>
            <span>No Game Found</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <BoxButton>Home</BoxButton>
            </div>
          </EmptyView>
        </div>
      )}
    </div>
  )
}
