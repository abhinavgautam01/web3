import { Keypair, Connection, Transaction, SystemProgram } from "@solana/web3.js"
import "dotenv/config"

const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY)))

const connection = new Connection("https://api.devnet.solana.com")

async function main(){
    const newAccountWithData = Keypair.generate()
    const dataSizeInBYTES = 99
    const lamports = await connection.getMinimumBalanceForRentExemption(dataSizeInBYTES)
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: newAccountWithData.publicKey,
            lamports,
            space: dataSizeInBYTES, 
            programId: payer.publicKey //transferred ownership...default SystemProgram
        })
    )
    await connection.sendTransaction(transaction, [payer, newAccountWithData])
    console.log(`New created account: ${newAccountWithData.publicKey}`)
}
main()