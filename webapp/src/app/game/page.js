'use client'
import React, { useEffect, useRef, useState } from 'react'
import InputField from '../components/inputField/inputField'
import styles from './game.module.css'
import BoxButton from '../components/boxButton/boxButton'
import {
  CHARACTERCARD_CONTRACTADDRESS,
  GAMEFACTORY_CONTRACTADDRESS,
} from '../ADDRESSES'
import { CHARACTERCARD_ABI, GAMEFACTORY_ABI } from '../ABI'
import CardBox from '../components/cardBox/cardBox'
import ScaleLoader from 'react-spinners/ScaleLoader'
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useSimulateContract,
} from 'wagmi'
import { goerli, opBNBTestnet } from 'viem/chains'
import { isValidAddress } from '../components/utilities/utilities'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../Interloop'
import { ethers } from 'ethers'
import { decodeTransactionLogs } from './helper'
import { useRouter } from 'next/navigation'
import { TextHelper } from '../charactercard/[id]/helper'

export default function Game() {
  const [challengee, setChallengee] = useState('')
  const [isLoadingNice, setIsLoadingNice] = useState(false)
  const account = useAccount()
  const router = useRouter()
  const { address } = useAccount()
  //const { writeContract } = useWriteContract()
  const [selectedCards, setSelectedCards] = useState([])
  const [alltokenId, setAlltokenId] = useState([])

  const { data: simulateData, error: simulateError } = useSimulateContract({
    abi: GAMEFACTORY_ABI,
    address: GAMEFACTORY_CONTRACTADDRESS,
    functionName: 'createNewGameManual',
    args: [challengee, selectedCards],
    account: address,
    chainId: opBNBTestnet.id,
  })

  const handleCardClick = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, cardId])
      }
    }
  }

  const requestChallenge = () => {
    if (selectedCards.length === 3 && isValidAddress(challengee)) {
      console.log('game started', challengee, selectedCards)
      setIsLoadingNice(true)
      sendRequest()
    } else {
      console.log('you need three characters')
    }
  }
  // test address 0x772A4f348d85FDd00e89fDE4C7CAe8628c8DAd19
  const allCharacterToken = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: 'returnAllOwnerTokenId',
    args: [address],
    account: address,
    chainId: opBNBTestnet.id,
  })
  useEffect(() => {
    setAlltokenId(allCharacterToken?.data)
  }, [allCharacterToken])

  const sendRequest = async () => {
    try {
      const request = await writeContract(config, {
        abi: GAMEFACTORY_ABI,
        address: GAMEFACTORY_CONTRACTADDRESS,
        functionName: 'createNewGameManual',
        args: [challengee, selectedCards],
        chainId: opBNBTestnet.id,
        account: address,
      })
      console.log(request)
      decodeTx(request)
    } catch (e) {
      setIsLoadingNice(false)
    }
  }

  const decodeTx = async (hashTx) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: hashTx,
    })
    let abi = [
      'event GameCreated(address indexed game, address indexed initiator, address indexed challengee, uint[] initiatorDeck)',
    ]
    let iface = new ethers.utils.Interface(abi)
    let gameEventDecode = decodeTransactionLogs(
      transactionReceipt.logs[0].data,
      transactionReceipt.logs[0].topics,
      iface
    )
    setIsLoadingNice(false)
    console.log('game :', gameEventDecode.args.game)
    router.push(`/game/${gameEventDecode.args.game}`)
  }
  return (
    <div>
      <div className={styles.centeredcontainer}>
        <div className={styles.centereddiv}>
          <div className="pt-10 pb-1">
            <span>Challengee</span>
          </div>
          <div>
            <InputField
              value={challengee}
              onChange={(e) => {
                const re = /(?:0[xX])?[0-9a-fA-F]+/
                if (e.target.value === '' || re.test(e.target.value)) {
                  setChallengee(e.target.value)
                }
              }}
              placeholder="Player ID"
            />
          </div>
          <div>
            <div className="pt-6 pb-1">
              <span>Select 3 Cards</span>
            </div>
            <div className="pb-5">
              <div className={styles.scrollablegridcontainer}>
                <div className={styles.cardgrid}>
                  {alltokenId?.map((cardId) => (
                    <CardBox
                      tokenId={cardId.toString()}
                      showStats={false}
                      key={cardId}
                      onClick={() => handleCardClick(cardId)}
                      style={{
                        backgroundColor: selectedCards.includes(cardId)
                          ? '#c3073f'
                          : '#1a1a1d',

                        padding: '5px',
                        margin: '5px',
                        cursor: 'pointer',
                      }}
                      height={80}
                      width={67}
                    >
                      <TextHelper lhsv={`ID#${cardId.toString()}`} />
                    </CardBox>
                  ))}
                </div>
              </div>
              {selectedCards.length > 0 ? (
                <div>
                  <h3>Selected Cards:</h3>
                  <ul style={{ display: 'flex' }}>
                    {selectedCards.map((id) => (
                      <li style={{ paddingRight: '10px' }} key={id}>
                        Token ID#{id.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <BoxButton
            disabled={isLoadingNice}
            onClick={async () => {
              console.log('Initiating')
              requestChallenge()
            }}
          >
            {isLoadingNice ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {' '}
                <ScaleLoader
                  color="#c3073f"
                  height={15}
                  margin={1}
                  radius={1}
                  width={3}
                />{' '}
                Loading
              </div>
            ) : (
              <>Request Challenge</>
            )}
          </BoxButton>
          {isLoadingNice ? (
            <span>You will be redirected to the Game when tx is done</span>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
