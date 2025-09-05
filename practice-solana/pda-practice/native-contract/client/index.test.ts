import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import {describe, expect, test, beforeAll } from "bun:test"
import { LiteSVM } from "litesvm"

describe("Create Pda from the client", ()=>{
    let svm: LiteSVM;
    let pda: PublicKey;
    let bump: number;
    let program_id: PublicKey;
    let payer: Keypair;

    beforeAll(()=>{
        svm = new LiteSVM();
        payer = new Keypair();
        program_id = PublicKey.unique();
        pda = PublicKey.unique();
        svm.addProgramFromFile(program_id, "./pda_practice.so");

        svm.airdrop(payer.publicKey, BigInt(5 * LAMPORTS_PER_SOL));

        [pda, bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("user1"), payer.publicKey.toBuffer()],
            program_id
        );

        let instruction = new TransactionInstruction({
            programId: program_id,
            keys: [
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: pda, isSigner: false, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            ],
            data: Buffer.from("")
        })

        const transaction = new Transaction().add(instruction);

        transaction.feePayer = payer.publicKey;
        transaction.recentBlockhash = svm.latestBlockhash();

        transaction.sign(payer);
        let res = svm.sendTransaction(transaction);
        // console.log(res.toString());
    });

    test("should create pda", ()=>{
        const balance = svm.getBalance(pda);
        expect(Number(balance)).toBeGreaterThan(0);
        expect(Number(balance)).toBe(1002240);

    })

})