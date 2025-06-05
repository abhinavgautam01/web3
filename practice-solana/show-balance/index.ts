import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const showBalance = async (publicKey: PublicKey) => {
  const connection = new Connection("http://localhost:8899", "confirmed");

  const response = await connection.getAccountInfo(publicKey);

  return response.lamports / LAMPORTS_PER_SOL;
};
