'use client'
import { useState, useEffect } from 'react'
import { CHARACTERCARD_ABI, GAME_ABI } from '../ABI'
import { CHARACTERCARD_CONTRACTADDRESS } from '../ADDRESSES'
import CardBox from '../components/cardBox/cardBox'
import './portfolio.css'
import { useReadContract, useAccount } from 'wagmi'
import { config } from '../charactercard/[id]/page'
import { opBNBTestnet } from 'viem/chains'
import { useRouter } from 'next/navigation'
import { TextHelper } from '../charactercard/[id]/helper'
import { HoriGridBox } from '../components/horiGridBox/horiGridBox'
import BoxButton from '../components/boxButton/boxButton'
import { ScaleLoader } from 'react-spinners'
import { isValidAddress } from '../components/utilities/utilities'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'

export default function Portfolio() {
  const account = useAccount()
  const { address } = useAccount()
  const router = useRouter()
  const [alltokenId, setAlltokenId] = useState([])
  const [allPlayerGames, setAllPlayerGames] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [selectedBox, setSelectedBox] = useState([])
  const [isLoadingNice, setIsLoadingNice] = useState()

  const characterCardBalance = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: 'balanceOf',
    args: [account],
    account: account,
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
  const handleBoxClick = (gameaddress) => {
    if (selectedBox.includes(gameaddress)) {
      setSelectedBox(selectedBox.filter((id) => id !== gameaddress))
    } else {
      if (selectedBox.length < 1) {
        setSelectedBox([...selectedBox, gameaddress])
      }
    }
  }

  const characterCardTokenID = (index) =>
    useReadContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: '_tokenOfOwnerByIndex',
      args: [account, index],
      account: account,
    })
  const acceptChallenge = () => {
    console.log(selectedBox, selectedBox.length, isValidAddress(selectedBox[0]))
    if (
      selectedBox.length === 1 &&
      isValidAddress(selectedBox[0]) &&
      selectedCards.length === 3
    ) {
      console.log('game started', selectedBox[0], selectedBox)
      setIsLoadingNice(true)
      sendRequest()
    } else {
      console.log('you need three characters')
    }
  }
  const playerGames = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: 'getPlayerGames',
    args: [address],
    account: account,
    chainId: opBNBTestnet.id,
  })

  const allCharacterToken = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: 'returnAllOwnerTokenId',
    args: [address],
    account: account,
    chainId: opBNBTestnet.id,
  })

  useEffect(() => {
    setAlltokenId(allCharacterToken?.data)
    setAllPlayerGames(playerGames?.data)
  }, [allCharacterToken, playerGames])

  const sendRequest = async () => {
    try {
      const request = await writeContract(config, {
        abi: GAME_ABI,
        address: selectedBox[0].toString(),
        functionName: 'acceptMatch',
        args: [selectedCards],
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
      'event GameStarted(address indexed initiator, address indexed game, uint indexed gameId)',
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
      <div className="centeredcontainer">
        <div className="centereddiv">
          <div className="padbox">
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <div style={{ padding: '15px' }}>
                <BoxButton
                  spinSharply={true}
                  disabled={isLoadingNice}
                  onClick={async () => {
                    console.log('Initiating')
                    acceptChallenge()
                  }}
                >
                  {isLoadingNice ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    <>Accept Challenge</>
                  )}
                </BoxButton>
              </div>
            </div>
            <div className="scrollablegridcontainer">
              {allPlayerGames ||
                ['0xe9b675C8fC1051363E6B1b200b9E38629fE464B7']?.map(
                  (gameadress) => (
                    <div
                      key={gameadress}
                      style={{
                        paddingLeft: '10px',
                        paddingRight: '10px',
                      }}
                    >
                      <div
                        style={{
                          paddingLeft: '1px',
                          paddingRight: '1px',
                          backgroundColor: selectedBox.includes(gameadress)
                            ? '#c3073f'
                            : '#1a1a1d',
                        }}
                      >
                        <HoriGridBox
                          onClick={() => {
                            handleBoxClick(gameadress)
                            console.log(gameadress)
                          }}
                        >
                          <TextHelper lhsv="Address" rhsv={gameadress} />
                        </HoriGridBox>
                      </div>
                    </div>
                  )
                )}
            </div>
            <br />
            <div className="scrollablegridcontainer">
              <div className="cardgrid">
                {alltokenId?.map((cardId) => (
                  <CardBox
                    showStats={false}
                    key={cardId}
                    onClick={() => handleCardClick(cardId)}
                    style={{
                      backgroundColor: selectedCards.includes(cardId)
                        ? '#c3073f'
                        : '#1a1a1d',

                      padding: '0px',
                      margin: '4px',
                      cursor: 'pointer',
                    }}
                    height={80}
                    width={67}
                  >
                    Card {cardId.toString()}
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

          <div className="padbox">
            <TextHelper lhsv="Your character cards, click to view" />
            <div className="gridcontainer">
              <div className="grid">
                {alltokenId?.map((cardId) => (
                  <CardBox
                    showStats={false}
                    key={cardId}
                    height={180}
                    width={130}
                    onClick={() => {
                      router.push(`/charactercard/${cardId.toString()}`, {
                        scroll: false,
                      })
                    }}
                  >
                    Card {cardId.toString()}
                  </CardBox>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
