import { describe, it, expect, beforeAll } from "bun:test";
import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

describe("Storage Contract", () => {
    let svm: LiteSVM;
    let payer: Keypair;
    let dataAccount: Keypair;
    let programId: PublicKey;

    beforeAll(() => {
        svm = new LiteSVM();
        payer = new Keypair();
        dataAccount = new Keypair();
        programId = PublicKey.unique();
        svm.addProgramFromFile(programId, "./native_storage_program.so");
        svm.airdrop(payer.publicKey, 10000000000000n);
        svm.expireBlockhash();

    });
  
    it("Should be able to intialize an account on chain",  () => {
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
            data: Buffer.from([ 0, 2, 0, 0, 0, 104, 105])
        })

        const tx = new Transaction().add(ix);
        tx.feePayer = payer.publicKey;
        tx.recentBlockhash = svm.latestBlockhash();
        tx.partialSign(payer);
        tx.partialSign(dataAccount);

        const result = svm.sendTransaction(tx);
        // console.log("test1: ", result.toString())

        let dataAccountInfo = svm.getAccount(dataAccount.publicKey);
        expect(dataAccountInfo?.data[0]).toBe(2);
        expect(dataAccountInfo?.data[1]).toBe(0);
        expect(dataAccountInfo?.data[2]).toBe(0);
        expect(dataAccountInfo?.data[3]).toBe(0);
        expect(dataAccountInfo?.data[4]).toBe(104);
        expect(dataAccountInfo?.data[5]).toBe(105);
        
    });
    
    it("should be able to update the string on chain", ()=> {
        const ix = new TransactionInstruction({
            programId,
            keys: [
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: dataAccount.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            ],
            data: Buffer.from([ 1, 14, 0, 0, 0, 65, 98, 104, 105, 110, 97, 118, 32, 71, 97, 117, 116, 97, 109])
        })
        
        const transaction = new Transaction().add(ix)
        
        transaction.feePayer = payer.publicKey;
        transaction.recentBlockhash = svm.latestBlockhash();
        transaction.partialSign(payer);
        transaction.partialSign(dataAccount);
        
        const response = svm.sendTransaction(transaction);
        // console.log("Update tx response:", response.toString());
        
        let dataAccountInfo = svm.getAccount(dataAccount.publicKey);
        expect(dataAccountInfo?.data[0]).toBe(14);
        expect(dataAccountInfo?.data[1]).toBe(0);
        expect(dataAccountInfo?.data[2]).toBe(0);
        expect(dataAccountInfo?.data[3]).toBe(0);
        expect(dataAccountInfo?.data[4]).toBe(65);
        expect(dataAccountInfo?.data[5]).toBe(98);
        expect(dataAccountInfo?.data[6]).toBe(104);
        expect(dataAccountInfo?.data[7]).toBe(105);
        expect(dataAccountInfo?.data[8]).toBe(110);
        expect(dataAccountInfo?.data[9]).toBe(97);
        expect(dataAccountInfo?.data[10]).toBe(118);
        expect(dataAccountInfo?.data[11]).toBe(32);
        expect(dataAccountInfo?.data[12]).toBe(71);
        expect(dataAccountInfo?.data[13]).toBe(97);
        expect(dataAccountInfo?.data[14]).toBe(117);
        expect(dataAccountInfo?.data[15]).toBe(116);
        expect(dataAccountInfo?.data[16]).toBe(97);
        expect(dataAccountInfo?.data[17]).toBe(109);
    })
});