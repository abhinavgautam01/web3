import { useWallet } from "@solana/wallet-adapter-react";

export function ShowPublicKey() {
  const wallet = useWallet();
  return (
    <div>
      {wallet.publicKey ? (
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
          Wallet Address: {wallet.publicKey?.toBase58()}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
