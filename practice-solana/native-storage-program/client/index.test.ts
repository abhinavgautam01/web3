import { describe, it, expect, beforeAll } from "bun:test";
import path from "path";
import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

describe("Storage Contract", () => {
    let svm: LiteSVM;
    let payer: Keypair;
    let dataAccount: Keypair;
    let programId: PublicKey;

    beforeAll(async () => {
        svm = new LiteSVM();
        payer = new Keypair();
        dataAccount = new Keypair();
        programId = PublicKey.unique();
        svm.addProgramFromFile(programId, "./native_storage_program.so");
        svm.airdrop(payer.publicKey, 10000000000000n);
        svm.expireBlockhash();

    });
  
    it("Should be able to intialize an account on chain", async () => {
        const ix = new TransactionInstruction({
            keys: [{
                pubkey: payer.publicKey,
                isSigner: true,
                isWritable: true,
            },{
                pubkey: dataAccount.publicKey,
                isSigner: true,
                isWritable: true,
            }, {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            }],
            programId: programId,
            data: Buffer.from([0, 2, 0, 0, 0, 104, 105])
        })

        const tx = new Transaction().add(ix);
        tx.feePayer = payer.publicKey;
        tx.recentBlockhash = svm.latestBlockhash();
        tx.partialSign(payer);
        tx.partialSign(dataAccount);

        const result = svm.sendTransaction(tx);

        let dataAccountInfo = svm.getAccount(dataAccount.publicKey);
        expect(dataAccountInfo?.data[0]).toBe(2);
        expect(dataAccountInfo?.data[1]).toBe(0);
        expect(dataAccountInfo?.data[2]).toBe(0);
        expect(dataAccountInfo?.data[3]).toBe(0);
        expect(dataAccountInfo?.data[4]).toBe(104);
        expect(dataAccountInfo?.data[5]).toBe(105);

    });
});