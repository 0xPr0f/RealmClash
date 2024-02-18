'use client'

import * as React from 'react'
import { injected, walletConnect } from 'wagmi/connectors'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import {
  rabbyWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Footer from './footer'
import Header from './header'
import { goerli, opBNBTestnet, sepolia } from 'viem/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
const { wallets } = getDefaultWallets()

export const opBNBchainTestnet = {
  id: 5611,
  name: 'opBNB Testnet',
  network: 'Optimistic BNB Testnet',
  iconUrl:
    'https://violet-reluctant-warbler-180.mypinata.cloud/ipfs/QmWtPYujXhaDX36UGoFeJyBXnXGi4GM47iXX8cSkhgSQTr',
  iconBackground: '#FFFFFF',
  nativeCurrency: {
    decimals: 18,
    name: 'opBNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: 'https://opbnb-testnet-rpc.bnbchain.org',
  },
  blockExplorers: {
    default: { name: 'opBNBscan', url: 'https://opbnb-testnet.bscscan.com/' },
    etherscan: { name: 'opBNBscan', url: 'https://opbnb-testnet.bscscan.com/' },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: 'Realm Clash',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: 'Others',
      wallets: [rabbyWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [opBNBTestnet],

  ssr: true,
})

const queryClient = new QueryClient()
export default function Interloop({ children }) {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            theme={darkTheme({
              accentColor: '#c3073f',
              accentColorForeground: '#1a1a1d',
              borderRadius: 'none',
              fontStack: 'system',
              overlayBlur: 'small',
            })}
          >
            <Header />
            <div className="divfixer">{children}</div>
            <Footer />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}
