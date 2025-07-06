import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div className="wallet-box">
      <h2>Solana Wallets</h2>
      <button
        className="wallet-btn"
        onClick={async () => {
          const seed = await mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
        }}
      >
        ➕ Add SOL Wallet
      </button>

      {publicKeys.length > 0 && (
        <div className="wallet-list">
          {publicKeys.map((key, idx) => (
            <div key={idx} className="wallet-address">
              Wallet {idx + 1}: {key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
