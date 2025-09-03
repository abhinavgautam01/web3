import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { describe, expect, test, beforeAll } from "bun:test"
import { LiteSVM } from "litesvm"

describe("Counter Program Tests", ()=>{
    let svm: LiteSVM;
    let program_id: PublicKey;
    let data_account: Keypair;
    let user_account: Keypair;

    beforeAll(()=>{
        svm = new LiteSVM();
        program_id = PublicKey.unique();
        svm.addProgramFromFile(program_id, "counter.so");
        data_account = new Keypair();
        user_account = new Keypair();
        svm.airdrop(user_account.publicKey, BigInt(3 * LAMPORTS_PER_SOL));
    });

    test("Intialized Counter", ()=>{
        const instruction = new TransactionInstruction({
            programId: program_id,
            keys: [
                {pubkey: data_account.publicKey, isSigner: true, isWritable: true},
                {pubkey: user_account.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            data: Buffer.from([0, 11, 0, 0, 0])
        })

        const transaction = new Transaction().add(instruction);
        transaction.recentBlockhash = svm.latestBlockhash();
        transaction.feePayer = user_account.publicKey;
        transaction.sign(data_account, user_account);
        let txn = svm.sendTransaction(transaction);
        svm.expireBlockhash;
        const updateAccountData = svm.getAccount(data_account.publicKey);
        if(!updateAccountData){
            throw new Error("Account not found");
        }

        expect(updateAccountData.data[0]).toBe(11)
        expect(updateAccountData.data[1]).toBe(0)
        expect(updateAccountData.data[2]).toBe(0)
        expect(updateAccountData.data[3]).toBe(0)
        
    });
    test("Instruction Double Test", ()=> {
        function double_counter(){
            const instruction = new TransactionInstruction({
                programId: program_id,
                keys: [
                    {pubkey: data_account.publicKey, isSigner: false, isWritable: true}
                ],
                data: Buffer.from([1])
            });
            let transaction = new Transaction().add(instruction)
            transaction.recentBlockhash = svm.latestBlockhash();
            transaction.feePayer = user_account.publicKey;
            transaction.sign(user_account);
            svm.sendTransaction(transaction);
            svm.expireBlockhash();
        }
        
        double_counter();
        double_counter();
        
        const updateAccountData = svm.getAccount(data_account.publicKey);
        if(!updateAccountData){
            throw new Error("Account not found")
        }
        
        expect(updateAccountData.data[0]).toBe(44);
        expect(updateAccountData.data[1]).toBe(0);
        expect(updateAccountData.data[2]).toBe(0);
        expect(updateAccountData.data[3]).toBe(0);
    })
    test("Instruction Half Test", ()=> {
        function half_counter(){
            const instruction = new TransactionInstruction({
                programId: program_id,
                keys: [
                    {pubkey: data_account.publicKey, isSigner: false, isWritable: true}
                ],
                data: Buffer.from([2])
            });
            let transaction = new Transaction().add(instruction)
            transaction.recentBlockhash = svm.latestBlockhash();
            transaction.feePayer = user_account.publicKey;
            transaction.sign(user_account);
            svm.sendTransaction(transaction);
            svm.expireBlockhash();
        }
        
        half_counter();
        
        const updateAccountData = svm.getAccount(data_account.publicKey);
        if(!updateAccountData){
            throw new Error("Account not found")
        }
        
        expect(updateAccountData.data[0]).toBe(22);
        expect(updateAccountData.data[1]).toBe(0);
        expect(updateAccountData.data[2]).toBe(0);
        expect(updateAccountData.data[3]).toBe(0);
    })
})