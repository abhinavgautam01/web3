import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRef } from "react";

export function Airdrop() {
  const ref = useRef();

  const wallet = useWallet();
  const { connection } = useConnection();
  async function sendAirdrop() {
    if (!wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }
    let value = Number(ref.current.value);
    try {
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        value * 1000000000,
      );

      await connection.confirmTransaction(signature, "confirmed");

      alert("Airdrop successful!");
    } catch (err) {
      console.error(err);
      alert("Airdrop failed");
    }
  }
  return (
    <div>
      <input ref={ref} type="number" placeholder="Enter amount" />
      <button onClick={sendAirdrop}>Send Airdrop</button>
    </div>
  );
}
