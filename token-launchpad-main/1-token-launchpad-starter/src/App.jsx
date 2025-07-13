import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
import { useMemo } from "react";
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

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              boxSizing: "border-box",
              margin: "20px"
            }}
          >
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
        </WalletModalProvider>
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TokenLaunchpad />
          </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
