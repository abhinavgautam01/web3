import { Connection, Keypair, VersionedTransaction }  from '@solana/web3.js'
import axios  from 'axios'
import { Wallet }  from '@project-serum/anchor'
import "dotenv/config"

const connection = new Connection('https://api.mainnet-beta.solana.com');

const wallet = new Wallet(
  Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY)))
);

async function main() {
    const response = await (
        await axios.get('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50'
        )
      );
      const quoteResponse = response.data;
      console.log(quoteResponse);

      try {
        const { data: { swapTransaction } } = await (
            await axios.post('https://quote-api.jup.ag/v6/swap', {
                quoteResponse,
                userPublicKey: wallet.publicKey.toString(),
            })
        );

        console.log("swapTransaction")
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        console.log(transaction);
          
        transaction.sign([wallet.payer]);
        const latestBlockHash = await connection.getLatestBlockhash();

        // Execute the transaction
        const rawTransaction = transaction.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid
        });
        console.log(`https://solscan.io/tx/${txid}`);
      } catch(e) {
        console.log(e)
      }
      
}

main();