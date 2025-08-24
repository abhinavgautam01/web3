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
	svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
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
    console.log("Lamports Value: ", svm.minimumBalanceForRentExemption(BigInt(4)))
    expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

    new TransactionInstruction ({
        keys: [
            {pubkey: dataAccount.publicKey, isSigner: true, isWritable: true},
        ],
        programId: this.programId,
        data
    })

});