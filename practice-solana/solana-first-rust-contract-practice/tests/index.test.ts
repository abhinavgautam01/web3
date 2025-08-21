import * as borsh from "borsh"
import { expect, test } from "bun:test"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { COUNTER_SIZE, CounterAccount, schema } from "./types";

let counterDataAcountKeypair = Keypair.generate();
let adminKeypair = Keypair.generate();
const connection = new Connection("http://127.0.0.1:8899");
const programId = new PublicKey("7AdRmLAcqWAbSN4b5tePD8ugxxsuv5hwxdxjgy4yNRFu");

test('increase count', async() => {
  const txn = await connection.requestAirdrop(adminKeypair.publicKey, 10 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(txn);

  const data = await connection.getAccountInfo(adminKeypair.publicKey);
//   console.log(data)

  const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);

  const ix = SystemProgram.createAccount({
    fromPubkey: adminKeypair.publicKey,
    programId: programId,
    newAccountPubkey: counterDataAcountKeypair.publicKey,
    lamports,
    space: COUNTER_SIZE,
  })

  const createAccountTxn = new Transaction()
  createAccountTxn.add(ix);

  const signature = await connection.sendTransaction(createAccountTxn, [adminKeypair, counterDataAcountKeypair])
  await connection.confirmTransaction(signature);

  console.log(counterDataAcountKeypair.publicKey.toBase58());

  const counterAccount = await connection.getAccountInfo(counterDataAcountKeypair.publicKey);
  if(!counterAccount){
    throw new Error("Counter account not found.");
  }
  console.log(counterAccount?.data);
  const counterCount = borsh.deserialize(schema, counterAccount?.data) as CounterAccount;

  console.log(counterCount.count);
  expect(counterCount.count).toBe(0);

})
