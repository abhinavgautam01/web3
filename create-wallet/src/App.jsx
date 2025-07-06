import { useState } from "react";
import "./App.css";
import { generateMnemonicAsync } from "bip39-web";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonicAsync();
    setMnemonic(mn);
  };

  return (
    <div className="app-container">
      <h1>Wallet Generator</h1>
      <input
        type="text"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Seed phrase will appear here"
        className="mnemonic-input"
      />
      <button
        type="button"
        onClick={handleGenerateMnemonic}
        className="generate-btn"
      >
        Create Seed Phrase
      </button>

      <div className="wallets">
        {mnemonic && (
          <div className="wallet">
            <SolanaWallet mnemonic={mnemonic} />
          </div>
        )}
        {mnemonic && (
          <div className="wallet">
            <EthWallet mnemonic={mnemonic} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
