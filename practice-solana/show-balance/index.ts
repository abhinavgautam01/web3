import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airdrop } from "../airdrop";

export const showBalance = async (publicKey: PublicKey) => {
  const connection = new Connection("http://localhost:8899", "confirmed");

  const response = await connection.getAccountInfo(publicKey);

  return response.lamports / LAMPORTS_PER_SOL;
};

(async () => {
  const publicKey = "7kLbkkbC43RacU1pmdt6YXVhRjErdtnZgmrYKFHXxEsS";
  const balance = await showBalance(new PublicKey(publicKey));
  console.log(`The balance for the key ${publicKey} is ${balance}`);
  
  await airdrop(new PublicKey(publicKey), 5)
  const updatedBalance = await showBalance(new PublicKey(publicKey))
  console.log(`Updated balance for the key ${publicKey} is ${updatedBalance}`);
})();
