import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { airdrop } from "../airdrop";
import { showBalance } from "../show-balance";

export const transferSol = async (
  fromKey: Keypair,
  toKey: PublicKey,
  amount: number
) => {
  const connection = new Connection("http://localhost:8899", "confirmed");

  const transaction = new Transaction();

  const instruction = SystemProgram.transfer({
    fromPubkey: fromKey.publicKey,
    toPubkey: toKey,
    lamports: LAMPORTS_PER_SOL * amount,
  });

  transaction.add(instruction);

  await sendAndConfirmTransaction(connection, transaction, [fromKey]);

  console.log("Done..!")
};

const secret = Uint8Array.from([112,235,193,10,131,255,49,62,140,189,116,36,230,4,181,177,68,163,21,23,39,193,42,49,63,69,222,90,194,18,13,168,140,175,250,63,133,149,63,161,11,173,196,119,153,17,176,184,69,129,36,199,158,147,174,124,35,65,202,14,201,93,9,70])

const fromKeyPair = Keypair.fromSecretKey(secret);
const toPublicKey = new PublicKey("7kLbkkbC43RacU1pmdt6YXVhRjErdtnZgmrYKFHXxEsS");

(async()=>{
    await airdrop(fromKeyPair.publicKey, 4)
    const fromInitBalance = await showBalance(fromKeyPair.publicKey)
    console.log(`Initial balance of from wallet is ${fromInitBalance}`);
    const toInitBalance = await showBalance(toPublicKey)
    console.log(`Initial balance of to wallet is ${toInitBalance}`);
    
    await transferSol(fromKeyPair, toPublicKey, 2)
    
    const fromUpdatedBalance = await showBalance(fromKeyPair.publicKey)
    console.log(`Updated balance of from wallet is ${fromUpdatedBalance}`);
    const toUpdatedBalance = await showBalance(toPublicKey)
    console.log(`Updated balance of to wallet is ${toUpdatedBalance}`);

})()