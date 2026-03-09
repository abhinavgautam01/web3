// import React, { FC, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { Airdrop } from "./components/Airdrop";
import { ShowBalance } from "./components/ShowBalance";
import { ShowPublicKey } from "./components/ShowPublicKey";
import { SendSol } from "./components/SendSol";
function App() {
  return (
    <>
      <ConnectionProvider
        endpoint={
          // "https://solana-devnet.g.alchemy.com/v2/vRdo6IKXBkzJL2eGt4hsM"
          "https://devnet.helius-rpc.com/?api-key=82500bfd-f822-45a3-88aa-5e464971e2f6"
        }
      >
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />

            {/* Aridrop is not working...!*/}
            {/* <Airdrop /> */}
            <ShowPublicKey />
            <ShowBalance />
            <SendSol />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
