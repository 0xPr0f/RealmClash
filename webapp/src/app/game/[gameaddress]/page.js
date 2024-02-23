'use client'
import React, { useEffect, useReducer, useState } from 'react'
//import { useRouter } from 'next/navigation'
import './game.css'
import CardBox, { CardBoxGame } from '@/app/components/cardBox/cardBox'
import BoxButton from '@/app/components/boxButton/boxButton'
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { GAME_ABI } from '@/app/ABI'
import EmptyView from '@/app/components/emptyView/emptyView'
import { GiCrossedSwords, GiSwordWound, GiPointySword } from 'react-icons/gi'
import { FaArrowsRotate } from 'react-icons/fa6'
import { opBNBTestnet } from 'viem/chains'
import { useWatchContractEvent } from 'wagmi'
import { config } from '@/app/Interloop'
import { writeContract } from '@wagmi/core'
import { notification } from 'antd'
import { Dropdown } from '@mui/base'
import { IoClose } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { Menu } from '@mui/base/Menu'
import { MenuButton } from '@mui/base/MenuButton'
import { MenuItem } from '@mui/base/MenuItem'
import { TextHelper } from '@/app/charactercard/[id]/helper'
import { shortenText } from '@/app/components/utilities/utilities'
import { IoSettingsSharp } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import Tooltip from '@mui/material/Tooltip'

export default function GameRoom({ params }) {
  const router = useRouter()
  const account = useAccount()
  const { address } = useAccount()
  const { isConnected } = useAccount()
  //const { writeContract } = useWriteContract();
  const [selectedCard, setSelectedCard] = useState(null)
  const [hash, setHash] = useState('')
  const [allYourCardsInGame, setAllYourCardsInGame] = useState()
  const [allOppositeCardsInGame, setAllOppositeCardsInGame] = useState()
  const [oppositePlayerAddress, setOppositePlayerAddress] = useState()
  const [ActiveCharacter, setActiveCharacter] = useState()
  const [MatchDetails, setMatchDetails] = useState()
  const [PowerPointCount, setPowerPointCount] = useState()
  const [ultCount, setUltCount] = useState()
  const [AddressTurnToPlay, setAddressTurnToPlay] = useState()
  const [isLoadingATX, setIsLoadingATX] = useState()
  const [api, contextHolder] = notification.useNotification()
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0)

  const [data, setData] = useState(null)

  const handleRef = () => {
    router.refresh() // This will refresh the router
  }

  const openNotification = ({ _message, _description, _duration, _icon }) => {
    api.open({
      message: _message,
      description: _description,
      duration: _duration || 2,
      icon: _icon,
    })
  }
  const handleCardClick = (index) => {
    setSelectedCard((prevSelectedCard) => {
      return prevSelectedCard === index ? null : index
    })
  }
  const checkIfSelectedCharacter = (id) => {
    if (!(id && selectedCard)) {
      setIsLoadingATX(false)
      openNotification({
        _message: 'Invalid Card',
        _description: 'No card selected, Select and card',
        _icon: <IoClose size={30} color="#c3073f" />,
      })
    }
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
    args: [address],
    account: account,
    chainId: opBNBTestnet.id,
  })
  const timeToULTCount = useReadContract(
    {
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: 'timeForUlt',
      args: [address],
      account: account,
      chainId: opBNBTestnet.id,
    },
    {
      enabled: false,
    }
  )

  const addressToPlay = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: 'addressToPlay',
    account: account,
    chainId: opBNBTestnet.id,
    query: { gcTime: 0 },
  })
  const useNormalAttack = async (tokenId) => {
    //console.log(selectedCard)
    if (!(tokenId && selectedCard)) {
      return checkIfSelectedCharacter(tokenId)
    }
    try {
      setIsLoadingATX(true)
      const hash = await writeContract(config, {
        abi: GAME_ABI,
        address: params.gameaddress,
        functionName: 'useNormalAttack',
        args: [tokenId.toString()],
        account: account,
      })
      //console.log(selectedCard)
      openNotification({
        _message: 'Used Normal Attack',
        _description: `Token ID: ${selectedCard}`,
        _icon: <FaCheck size={30} color="#c3073f" />,
      })
      setIsLoadingATX(false)
      setHash(hash)
    } catch (e) {
      setIsLoadingATX(false)
      openNotification({
        _message: 'Used Normal Attack',
        _description: 'Move Unsuccessful',
        _icon: <IoClose size={30} color="#c3073f" />,
      })
    }
  }
  const useULT2Attack = async (tokenId) => {
    if (!(tokenId && selectedCard)) {
      return checkIfSelectedCharacter(tokenId)
    }
    try {
      setIsLoadingATX(true)
      const hash = await writeContract(config, {
        abi: GAME_ABI,
        address: params.gameaddress,
        functionName: 'useUlt2Attack',
        args: [tokenId.toString()],
        account: account,
      })
      //console.log(selectedCard)

      openNotification({
        _message: 'Used ULT2 Attack',
        _description: `Token ID: ${selectedCard}`,
        _icon: <FaCheck size={30} color="#c3073f" />,
      })
      setIsLoadingATX(false)
      setHash(hash)
    } catch (e) {
      setIsLoadingATX(false)
      openNotification({
        _message: 'Used ULT2 Attack',
        _description: 'Move Unsuccessful',
        _icon: <IoClose size={30} color="#c3073f" />,
      })
    }
  }
  const useULT3Attack = async (tokenId) => {
    if (!(tokenId && selectedCard)) {
      return checkIfSelectedCharacter(tokenId)
    }
    try {
      setIsLoadingATX(true)
      const hash = await writeContract(config, {
        abi: GAME_ABI,
        address: params.gameaddress,
        functionName: 'useUlt3Attack',
        args: [tokenId.toString()],
        account: account,
      })
      //console.log(selectedCard)
      openNotification({
        _message: 'Used ULT3 Attack',
        _description: `Token ID: ${selectedCard}`,
        _icon: <FaCheck size={30} color="#c3073f" />,
      })
      setIsLoadingATX(false)
      setHash(hash)
    } catch (e) {
      setIsLoadingATX(false)
      openNotification({
        _message: 'Used ULT3 Attack',
        _description: 'Move Unsuccessful',
        _icon: <IoClose size={30} color="#c3073f" />,
      })
    }
  }
  const switchCharacter = async (tokenId) => {
    if (!(tokenId && selectedCard)) {
      return checkIfSelectedCharacter(tokenId)
    }
    try {
      setIsLoadingATX(true)
      const hash = await writeContract(config, {
        abi: GAME_ABI,
        address: params.gameaddress,
        functionName: 'setSwitchActiveCharacter',
        args: [tokenId.toString()],
        account: account,
      })

      openNotification({
        _message: 'Used Character Switch',
        _description: `Plotting a strategic switch to Token ID: ${selectedCard}`,
        _duration: 3,
        _icon: <FaCheck color="#c3073f" />,
      })
      //console.log(selectedCard)
      setIsLoadingATX(false)
      setHash(hash)
    } catch (e) {
      setIsLoadingATX(false)
      openNotification({
        _message: 'Switch character',
        _description: `Move Unsuccessful`,
        _icon: <IoClose color="#c3073f" />,
      })
    }
  }
  const {
    isFetching: isFetchingReceipt,
    isLoading: isLoadingReceipt,
    data: receipt,
    isFetched,
    isSuccess,
    isError: isErrorReceipt,
    error: errorTransaction,
  } = useWaitForTransactionReceipt({
    hash: hash,
    chainId: opBNBTestnet.id,
    query: {
      enabled: true,
    },
  })

  useEffect(() => {
    if (isFetched && !!receipt) {
      switch (receipt.status) {
        case 'success': {
          returnFetch()
          break
        }
        case 'reverted': {
          onSettled?.(receipt, error)
          break
        }
      }
    }
  }, [isFetched, receipt])
  const returnFetch = () => {
    returnOtherAddress?.refetch()
    activeCharacter?.refetch()
    charactersTokenIdsY?.refetch()
    charactersTokenIdsO?.refetch()
    powerPointCount?.refetch()
    addressToPlay?.refetch()
    timeToULTCount?.refetch()
    matchDetails?.refetch()
  }
  const returnSetStates = () => {
    setOppositePlayerAddress(returnOtherAddress?.data)
    setActiveCharacter(activeCharacter.data)
    setAllYourCardsInGame(charactersTokenIdsY?.data)
    setMatchDetails(matchDetails?.data)
    setAllOppositeCardsInGame(charactersTokenIdsO?.data)
    setPowerPointCount(powerPointCount?.data)
    setAddressTurnToPlay(addressToPlay?.data)
    setUltCount(timeToULTCount?.data)
  }
  useEffect(() => {
    setOppositePlayerAddress(returnOtherAddress?.data)
    setActiveCharacter(activeCharacter.data)
    setAllYourCardsInGame(charactersTokenIdsY?.data)
    setMatchDetails(matchDetails?.data)
    setAllOppositeCardsInGame(charactersTokenIdsO?.data)
    setPowerPointCount(powerPointCount?.data)
    setAddressTurnToPlay(addressToPlay?.data)
    setUltCount(timeToULTCount?.data)
  }, [selectedCard])

  useEffect(() => {
    setOppositePlayerAddress(returnOtherAddress?.data)
    setActiveCharacter(activeCharacter.data)
    setAllYourCardsInGame(charactersTokenIdsY?.data)
    setMatchDetails(matchDetails?.data)
    setAllOppositeCardsInGame(charactersTokenIdsO?.data)
    setPowerPointCount(powerPointCount?.data)
    setAddressTurnToPlay(addressToPlay?.data)
    setUltCount(timeToULTCount?.data)
  })
  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'setSwitchCharacter',
    onLogs(logs) {
      //console.log('SwitchCharacter logs:', logs)
      returnFetch()
      setActiveCharacter(activeCharacter?.data)
      setOppositePlayerAddress(returnOtherAddress?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setMatchDetails(matchDetails?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setPowerPointCount(powerPointCount?.data)
      setAddressTurnToPlay(addressToPlay?.data)
      setUltCount(timeToULTCount?.data)
    },
  })
  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'TakeDamage',
    onLogs(logs) {
      // console.log('Take Damage logs:', logs)
      returnFetch()
      setActiveCharacter(activeCharacter?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setOppositePlayerAddress(returnOtherAddress?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setMatchDetails(matchDetails?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setPowerPointCount(powerPointCount?.data)
      setAddressTurnToPlay(addressToPlay?.data)
      setUltCount(timeToULTCount?.data)
    },
  })
  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'GameStarted',
    onLogs(logs) {
      //console.log('Game started:', logs)
      returnFetch()
      setActiveCharacter(activeCharacter?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setOppositePlayerAddress(returnOtherAddress?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setMatchDetails(matchDetails?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setPowerPointCount(powerPointCount?.data)
      setAddressTurnToPlay(addressToPlay?.data)
      setUltCount(timeToULTCount?.data)
    },
  })
  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'setSwitchCharacter',
    onLogs(logs) {
      //console.log('Switch character logs:', logs)
      returnFetch()
      setActiveCharacter(activeCharacter?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setOppositePlayerAddress(returnOtherAddress?.data)
      setAllYourCardsInGame(charactersTokenIdsY?.data)
      setMatchDetails(matchDetails?.data)
      setAllOppositeCardsInGame(charactersTokenIdsO?.data)
      setPowerPointCount(powerPointCount?.data)
      setAddressTurnToPlay(addressToPlay?.data)
    },
  })

  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'GameWon',
    onLogs(logs) {
      //console.log('Game won:', logs)
      returnFetch()
      setMatchDetails(matchDetails?.data)
    },
    pollingInterval: 300_000,
  })
  useWatchContractEvent({
    address: params?.gameaddress,
    abi: GAME_ABI,
    eventName: 'GameAccepted',
    onLogs(logs) {
      //console.log('Game accepted:', logs)
      returnFetch()
      setMatchDetails(matchDetails?.data)
      returnSetStates()
    },
  })
  return (
    <div>
      {/*}
      {console.log(ActiveCharacter?.toString())}
      {console.log(MatchDetails)}
      {console.log('address to play', AddressTurnToPlay)}
  */}
      {contextHolder}
      <div style={{ padding: '20px' }}>
        address : {JSON.stringify(params.gameaddress)}
      </div>
      {params.gameaddress.length === 42 ? (
        <div>
          <div className="game-board">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <div className="cards-up">
                {allOppositeCardsInGame?.map((cardId) => (
                  <CardBoxGame
                    gameaddress={params.gameaddress}
                    showStats={true}
                    tokenId={cardId}
                    key={cardId}
                  >
                    Card {cardId.toString()}
                  </CardBoxGame>
                ))}
              </div>
              <div>
                <Dropdown>
                  <Tooltip title="stats dropdown and refresh" arrow>
                    <MenuButton>
                      <BoxButton
                        onClick={() => {
                          returnFetch()
                        }}
                      >
                        <IoSettingsSharp color="#c3073f" />
                      </BoxButton>
                    </MenuButton>
                  </Tooltip>
                  <Menu>
                    <br />
                    <MenuItem>
                      <TextHelper
                        lhsv="Game ID:"
                        rhsv={MatchDetails && MatchDetails[0]?.toString()}
                      />
                    </MenuItem>
                    <MenuItem>
                      <TextHelper
                        lhsv="Accepted Time:"
                        rhsv={new Date(
                          MatchDetails && MatchDetails[2]?.toString()
                        )
                          .toLocaleString()
                          .toString()}
                      />
                    </MenuItem>
                    <MenuItem>
                      <TextHelper
                        lhsv="Game Started:"
                        rhsv={MatchDetails && MatchDetails[4]?.toString()}
                      />
                    </MenuItem>
                    <MenuItem>
                      <TextHelper
                        lhsv="Winner:"
                        rhsv={
                          MatchDetails && shortenText(MatchDetails[8], 4, 4)
                        }
                      />
                    </MenuItem>
                    <MenuItem>
                      <TextHelper
                        lhsv="Game Over:"
                        rhsv={MatchDetails && MatchDetails[7]?.toString()}
                      />
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </div>
            </div>
            <div className="cardsdown">
              <Tooltip title="switch character" arrow>
                <div className="buttons">
                  <BoxButton
                    disabled={isLoadingATX}
                    outsidePadding="20px"
                    borderRadius="100%"
                    height="40px"
                    width="40px"
                    onClick={async () => {
                      //console.log('use button check if disabled')
                      switchCharacter(selectedCard)
                    }}
                  >
                    <FaArrowsRotate size={20} fontWeight={1} />
                  </BoxButton>
                </div>
              </Tooltip>
              <div className="cards-down">
                {allYourCardsInGame?.map((cardId) => (
                  <CardBoxGame
                    gameaddress={params.gameaddress}
                    tokenId={cardId.toString()}
                    key={cardId}
                    className={`card ${
                      selectedCard === Number(cardId) ? 'selected' : ''
                    }`}
                    onClick={() => handleCardClick(Number(cardId))}
                  >
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      Card {cardId.toString()}
                      {activeCharacter.data?.toString() ===
                      cardId.toString() ? (
                        <Tooltip title="active character" arrow>
                          <div className="circle"></div>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </span>
                  </CardBoxGame>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '250px',
                }}
              >
                <div>
                  <TextHelper
                    lhsv={
                      AddressTurnToPlay === address
                        ? 'Your turn to play'
                        : 'Opponent turn to play'
                    }
                  />
                  <TextHelper
                    lhsv="Power Point:"
                    rhsv={
                      !(PowerPointCount === undefined)
                        ? PowerPointCount.toString()
                        : 2
                    }
                  />
                  <TextHelper
                    lhsv="Ult rounds:"
                    rhsv={!(ultCount === undefined) ? ultCount.toString() : 2}
                  />
                </div>
                {/*You will have to be connected to be able to see the buttons to do stuff*/}
                <div className="theAttackButtons">
                  <div className="buttons">
                    <Tooltip title="normal attack {weak}" arrow>
                      <div>
                        <BoxButton
                          wantText="+1ur"
                          disabled={isLoadingATX}
                          outsidePadding="20px"
                          borderRadius="100%"
                          height="80px"
                          width="80px"
                          onClick={async () => {
                            //console.log('use button check if disabled')
                            useNormalAttack(selectedCard)
                          }}
                        >
                          {' '}
                          <GiCrossedSwords size={43} />
                        </BoxButton>
                      </div>
                    </Tooltip>
                    <Tooltip title="ultimate attack {medium}" arrow>
                      <div>
                        <BoxButton
                          wantText="-2pp,-2ur"
                          disabled={isLoadingATX}
                          borderRadius="100%"
                          height="68px"
                          width="68px"
                          onClick={() => {
                            //console.log('use button check if disabled')
                            useULT2Attack(selectedCard)
                          }}
                        >
                          <GiSwordWound size={40} />
                        </BoxButton>
                      </div>
                    </Tooltip>
                    <Tooltip title="ultimate attack {strong}" arrow>
                      <div>
                        <BoxButton
                          wantText="-4pp,-3ur"
                          disabled={isLoadingATX}
                          outsidePadding="20px"
                          borderRadius="100%"
                          height="60px"
                          width="60px"
                          onClick={() => {
                            //console.log('use button check if disabled')
                            useULT3Attack(selectedCard)
                          }}
                        >
                          <GiPointySword size={40} />
                        </BoxButton>
                      </div>
                    </Tooltip>
                  </div>
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
