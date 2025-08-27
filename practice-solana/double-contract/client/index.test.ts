import { test, expect } from "bun:test"
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
    TransactionInstruction,
} from "@solana/web3.js";

test("one transfer", () => {
	const svm = new LiteSVM();
    const contractKey = PublicKey.unique();
    svm.addProgramFromFile(contractKey, "./double_contract.so");
	const payer = new Keypair();
	svm.airdrop(payer.publicKey, BigInt(5 * LAMPORTS_PER_SOL));
	const blockhash = svm.latestBlockhash();
    const dataAccount = Keypair.generate();
	const ixs = [
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
			space: 4,
			// lamports: 91872 * LAMPORTS_PER_SOL,
			lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            programId: contractKey
		}),
	];
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	tx.add(...ixs);
    tx.feePayer = payer.publicKey;
	tx.sign(payer, dataAccount);
	svm.sendTransaction(tx);
    const balanceAfter = svm.getBalance(dataAccount.publicKey);
    
    expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));
    function double_it(){
        const ix2 = new TransactionInstruction ({
            keys: [
                {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true},
            ],
            programId: contractKey,
            data: Buffer.from([])
        });
        
        const blockhash = svm.latestBlockhash();
        const tx2 = new Transaction();
        tx2.recentBlockhash = blockhash;
        tx2.feePayer = payer.publicKey;
        tx2.add(ix2);
        tx2.sign(payer);
        svm.sendTransaction(tx2);
        svm.expireBlockhash();
    }
    double_it();
    double_it();
    double_it();
    double_it();
    
    const newDataAccount = svm.getAccount(dataAccount.publicKey);

    expect(newDataAccount?.data[0]).toBe(8);
    expect(newDataAccount?.data[1]).toBe(0);
    expect(newDataAccount?.data[2]).toBe(0);
    expect(newDataAccount?.data[3]).toBe(0);
});