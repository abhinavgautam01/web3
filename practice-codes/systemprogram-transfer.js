import {Keypair, Connection, Transaction, SystemProgram} from "@solana/web3.js"
import 'dotenv/config'

const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY)))

const connection = new Connection("https://api.devnet.solana.com")

async function main(){
    const newAccount = Keypair.generate()
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: newAccount.publicKey, 
            lamports: 2 * 1e9
        })
    )
    await connection.sendTransaction(transaction, [payer])
    console.log(`Transferred to : ${newAccount.publicKey.toBase58()}`)
}

main()