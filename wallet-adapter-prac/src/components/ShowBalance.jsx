import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useRef } from "react";

export function ShowBalance() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const ref = useRef();

  function truncateToTwoDecimals(num) {
    return Math.floor(num * 1000) / 1000;
  }

  async function getBalance() {
    const bal = await connection.getBalance(wallet.publicKey);
    const balance = bal / LAMPORTS_PER_SOL;
    ref.current.innerHTML = truncateToTwoDecimals(balance) + "SOL";
  }

  useEffect(() => {
    getBalance();
  });

  return (
    <div>
      Current Balance:{" "}
      {wallet.publicKey ? <span ref={ref}></span> : "Connect Your Wallet"}
    </div>
  );
}
