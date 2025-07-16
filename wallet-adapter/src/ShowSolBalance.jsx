import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect } from "react";

export function ShowSolBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();

  async function getBalance() {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      document.getElementById("balance").innerHTML = balance / LAMPORTS_PER_SOL + " SOL";
    }
  }

  useEffect(()=>{
    getBalance()
  })

  return (
    <div>
        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
          Current SOL : {wallet.publicKey ? (<span id="balance"></span>):("Connect Your Wallet..!") } 
        </p>
    </div>
  );
}
