import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"

const connection = new Connection("http://127.0.0.1:8899")
async function main(){
    const key_pair = new Keypair();
    const dataAccount = new Keypair();

    const balance = await connection.getBalance(key_pair.publicKey)
    console.log("Initial balance: ", balance);

    const signature = await connection.requestAirdrop(key_pair.publicKey, 100 * LAMPORTS_PER_SOL)
    console.log("Signature: ", signature);

    await connection.confirmTransaction(signature);
    const updated_balance = await connection.getBalance(key_pair.publicKey)
    console.log("Updated balance: ", updated_balance);

    const rent_lamports = await connection.getMinimumBalanceForRentExemption(14);

    const instruction = SystemProgram.createAccount({
        fromPubkey: key_pair.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: rent_lamports,
        space: 14,
        programId: SystemProgram.programId,
    })

    const transaction = new Transaction().add(instruction)
    
    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.feePayer = key_pair.publicKey;
    // transaction.sign(key_pair)
    await connection.sendTransaction(transaction, [key_pair, dataAccount]);

    console.log(dataAccount.publicKey.toBase58());
}

main()