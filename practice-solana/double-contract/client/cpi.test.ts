import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect} from "bun:test"
import { LiteSVM } from "litesvm"

test("Cpi works as expected", async()=>{
    let svm = new LiteSVM();

    let double_contract = PublicKey.unique();
    let cpi_contract = PublicKey.unique();

    svm.addProgramFromFile(double_contract, "./double_contract.so");
    svm.addProgramFromFile(cpi_contract, "./cpi_contract.so");

    let dataAcc = new Keypair();
    let userAccount = new Keypair();
    svm.airdrop(userAccount.publicKey, BigInt(LAMPORTS_PER_SOL * 5))

    createDataOnChain(svm, dataAcc, userAccount, double_contract);
    function double_it(){
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: dataAcc.publicKey, isSigner: true, isWritable: true},
                {pubkey: double_contract, isSigner: false, isWritable: false},
            ],
            programId: cpi_contract,
            data: Buffer.from([])
        })
        
        let transaction = new Transaction().add(ix)
        
        const blockhash = svm.latestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = userAccount.publicKey;
        transaction.sign(userAccount, dataAcc);
        
        svm.sendTransaction(transaction);
        svm.expireBlockhash();    
    }

    double_it();
    double_it();
    double_it();
    double_it();
    const dataAccountData = svm.getAccount(dataAcc.publicKey)
    expect(dataAccountData?.data[0]).toBe(8);
    expect(dataAccountData?.data[1]).toBe(0);
    expect(dataAccountData?.data[2]).toBe(0);
    expect(dataAccountData?.data[3]).toBe(0);

})

function createDataOnChain(svm: LiteSVM, dataAccount: Keypair, payer: Keypair, contractPubKey: PublicKey){
    const blockhash = svm.latestBlockhash();
	const ixs = [
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
			space: 4,
			// lamports: 91872 * LAMPORTS_PER_SOL,
			lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            programId: contractPubKey
		}),
	];
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;
	tx.add(...ixs);
	tx.sign(payer, dataAccount);
	svm.sendTransaction(tx);
}