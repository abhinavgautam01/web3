import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import { SendTokens } from "./SendTokens";
import { SignMessage } from "./SignMessage";
import { ShowSolBalance } from "./ShowSolBalance";
import { ShowPublicKey } from "./ShowPublicKey";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{ margin: "30px"}}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "70vh",
                  width: "50vw",
                  border: "2px solid",
                  backgroundColor: "whitesmoke",
                }}
              >
                <ShowPublicKey />
                <ShowSolBalance />
                <SignMessage />
                <SendTokens />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
