import { useEffect, useState } from 'react'
import { readContract } from '@wagmi/core'
import { config } from '@/app/Interloop'
import { useAccount } from 'wagmi'
import { opBNBTestnet } from 'viem/chains'
import { GAME_ABI } from '@/app/ABI'

export const useTryReadContract = (gameaddress) => {
  const [data, setData] = useState(null)
  const { account } = useAccount()
  useEffect(async () => {
    const address = await readContract(config, {
      abi: GAME_ABI,
      address: gameaddress,
      functionName: 'addressToPlay',
      account: account,
      chainId: opBNBTestnet.id,
    })
    const value = address?.data
    setData(value)
  }, [])

  return { data }
}
