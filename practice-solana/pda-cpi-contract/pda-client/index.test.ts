import { test, expect, beforeAll, describe } from "bun:test";
import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, } from "@solana/web3.js";

describe("Create pda from client", () => {
  let liveSvm: LiteSVM;
  let pda: PublicKey;
  let bump: number;
  let programId: PublicKey;
  let payer: Keypair;

  beforeAll(() => {
    liveSvm = new LiteSVM();
    programId = PublicKey.unique();
    payer = Keypair.generate();
    liveSvm.addProgramFromFile(programId, "./pda_cpi_contract.so");
    liveSvm.airdrop(payer.publicKey, BigInt(10000000000));
    [pda, bump] = PublicKey.findProgramAddressSync([payer.publicKey.toBuffer(), Buffer.from("user")], programId);
    
    let ix = new TransactionInstruction({
      keys: [
        {
          pubkey: payer.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        }
      ],
      programId,
      data: Buffer.from("")
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = liveSvm.latestBlockhash();
    tx.sign(payer);
    let res = liveSvm.sendTransaction(tx);
  });

  test("should create pda", () => {
    const balance = liveSvm.getBalance(pda);
    expect(Number(balance)).toBeGreaterThan(0);
    expect(Number(balance)).toBe(100_000_000);
  });
  
});