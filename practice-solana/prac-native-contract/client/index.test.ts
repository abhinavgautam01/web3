import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import {describe, beforeAll, test, it, expect} from "bun:test"
import { LiteSVM } from "litesvm"

describe("Practice Native Calculator Contract", ()=>{
    let svm: LiteSVM;
    let data_account: Keypair;
    let payer: Keypair;
    let program_id: PublicKey;
    
    beforeAll(()=>{
        svm = new LiteSVM(),
        data_account = new Keypair()
        payer = new Keypair()
        program_id = PublicKey.unique()
        svm.addProgramFromFile(program_id, "prac_native_contract.so")
        svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL*10))
        
        let ix = SystemProgram.createAccount ({
            newAccountPubkey: data_account.publicKey,
            fromPubkey: payer.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(10))),
            space: 4,
            programId: program_id
        })
        let tx = new Transaction().add(ix)
        tx.feePayer = payer.publicKey
        tx.recentBlockhash = svm.latestBlockhash()
        tx.sign(payer, data_account)
        svm.sendTransaction(tx);

    })

    test("Initializing the Number", ()=> {
        let instruction = new TransactionInstruction({
            keys: [
                {pubkey: data_account.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
            ],
            programId: program_id,
            data: Buffer.from([0, 2, 0, 0, 0])
        })

        let transaction = new Transaction().add(instruction)

        transaction.feePayer = payer.publicKey
        transaction.recentBlockhash = svm.latestBlockhash();
        transaction.partialSign(data_account)
        transaction.partialSign(payer)

        svm.sendTransaction(transaction);

        let data = svm.getAccount(data_account.publicKey);
        expect(data?.data[0]).toBe(2)
        expect(data?.data[1]).toBe(0)
        expect(data?.data[2]).toBe(0)
        expect(data?.data[3]).toBe(0)
    })

    test("Adding with the Number", ()=> {
        let instruction = new TransactionInstruction({
            keys: [
                {pubkey: data_account.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
            ],
            programId: program_id,
            data: Buffer.from([1, 2, 0, 0, 0])
        })

        let transaction = new Transaction().add(instruction)

        transaction.feePayer = payer.publicKey
        transaction.recentBlockhash = svm.latestBlockhash();
        transaction.partialSign(data_account)
        transaction.partialSign(payer)

        svm.sendTransaction(transaction);

        let data = svm.getAccount(data_account.publicKey);
        expect(data?.data[0]).toBe(4)
        expect(data?.data[1]).toBe(0)
        expect(data?.data[2]).toBe(0)
        expect(data?.data[3]).toBe(0)
    })

    test("Subtracting with the Number", ()=> {
        let instruction = new TransactionInstruction({
            keys: [
                {pubkey: data_account.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
            ],
            programId: program_id,
            data: Buffer.from([2, 2, 0, 0, 0])
        })

        let transaction = new Transaction().add(instruction)

        transaction.feePayer = payer.publicKey
        transaction.recentBlockhash = svm.latestBlockhash();
        transaction.partialSign(data_account)
        transaction.partialSign(payer)

        svm.sendTransaction(transaction);

        let data = svm.getAccount(data_account.publicKey);
        expect(data?.data[0]).toBe(2)
        expect(data?.data[1]).toBe(0)
        expect(data?.data[2]).toBe(0)
        expect(data?.data[3]).toBe(0)
    })

})