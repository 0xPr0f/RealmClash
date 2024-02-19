'use client'
import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { GAMEFACTORY_ABI } from '../ABI'
import { GAMEFACTORY_CONTRACTADDRESS } from '../ADDRESSES'
import { useRouter } from 'next/navigation'
import { opBNBTestnet } from 'viem/chains'
import { config } from '../Interloop'
import { HoriGridBox } from '../components/horiGridBox/horiGridBox'
import { TextHelper } from '../charactercard/[id]/helper'
import { FaExternalLinkAlt } from 'react-icons/fa'

export default function Activity() {
  const { address } = useAccount()
  const [totalGames, setTotalGames] = useState()
  const router = useRouter()
  const getTotalGames = useReadContract({
    abi: GAMEFACTORY_ABI,
    address: GAMEFACTORY_CONTRACTADDRESS,
    functionName: 'allGames',
    config: config,
    chainId: opBNBTestnet.id,
  })
  useEffect(() => {
    setTotalGames(getTotalGames.data)
  }, [getTotalGames])
  return (
    <div>
      <span>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <TextHelper lhsv="This is the activity page:" />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {totalGames?.map((game) => (
              <HoriGridBox key={game}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '15px',
                  }}
                >
                  <div style={{ padding: '10px' }}>
                    <TextHelper lhsv="Game Address:" rhsv={game.toString()} />
                  </div>
                  <FaExternalLinkAlt
                    color="#c3073f"
                    onClick={() => {
                      router.push(`/game/${game.toString()}`)
                      console.log(game)
                    }}
                  />
                </div>
              </HoriGridBox>
            ))}
          </div>
        </div>
      </span>
    </div>
  )
}

const ActivityBar = ({ children }) => {
  return (
    <div>
      <span key={game}>{children}</span>
    </div>
  )
}
