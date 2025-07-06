import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
    <div className="wallet-box">
      <h2>Ethereum Wallets</h2>
      <button
        className="wallet-btn"
        onClick={async () => {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const wallet = new Wallet(child.privateKey);
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
      >
        ➕ Add ETH Wallet
      </button>

      {addresses.length > 0 && (
        <div className="wallet-list">
          {addresses.map((addr, idx) => (
            <div key={idx} className="wallet-address">
              Wallet {idx + 1}: {addr}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
