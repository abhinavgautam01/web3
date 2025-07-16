import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
export function TokenLaunchpad() {

    const wallet = useWallet();
    const { connection } = useConnection();

    async function createToken(){
        // const name = document.getElementById("name").value
        // const symbol = document.getElementById("symbol").value
        // const image = document.getElementById("image").value
        // const supply = document.getElementById("supply").value

        const newAccount = Keypair.generate()
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: newAccount.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(newAccount.publicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
        );
        
        const recentBlockHash = await connection.getLatestBlockhash()
        transaction.recentBlockhash = recentBlockHash.blockhash
        transaction.feePayer = wallet.publicKey

        transaction.partialSign(newAccount)
        const response = await wallet.sendTransaction(transaction, connection);
        console.log(response)
    }
    return  <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input id="name" name="tokenName" className='inputText' type='text' placeholder='Name'></input> <br />
        <input id="symbol" name="tokenSymbol" className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input id="image" name="imageUrl" className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input id="supply" name="initialSupply" className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button className='btn' onClick={createToken}>Create a token</button>
    </div>
}