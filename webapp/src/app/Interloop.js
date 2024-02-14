"use client";

import * as React from "react";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Footer from "./footer";
import Header from "./header";

const { wallets } = getDefaultWallets();

export const opBNBchain = {
  id: 5611,
  name: "opBNB Testnet",
  network: "Optimistic BNB Testnet",
  iconUrl:
    "https://violet-reluctant-warbler-180.mypinata.cloud/ipfs/QmWtPYujXhaDX36UGoFeJyBXnXGi4GM47iXX8cSkhgSQTr",
  iconBackground: "#FFFFFF",
  nativeCurrency: {
    decimals: 18,
    name: "opBNB",
    symbol: "tBNB",
  },
  rpcUrls: {
    default: "https://opbnb-testnet-rpc.bnbchain.org/",
  },
  blockExplorers: {
    default: { name: "opBNBscan", url: "https://opbnb-testnet.bscscan.com/" },
    etherscan: { name: "opBNBscan", url: "https://opbnb-testnet.bscscan.com/" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "Realm Clash",
  projectId: "YOUR_PROJECT_ID",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [opBNBchain],
  ssr: true,
});
const queryClient = new QueryClient();

export default function Interloop({ children }) {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            theme={lightTheme({
              accentColor: "#7b3fe4",
              accentColorForeground: "white",
              borderRadius: "none",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <Header />
            <div className="divfixer">{children}</div>
            <Footer />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}