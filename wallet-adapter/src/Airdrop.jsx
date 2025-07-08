import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export function Airdrop(){
    const wallet = useWallet()
    const { connection } = useConnection()

    async function sendAirdropToUser(){
        const amount = document.getElementById("amountTextBox")
        const sol = parseFloat(amount.value);
        const lamports = sol * 1e9;
        await connection.requestAirdrop(wallet.publicKey, lamports)
        alert("Airdroped  successfull..!")
        
    }

    return (
        <div>
        <input id="amountTextBox" type="text" placeholder="Amount"></input>
        <button onClick={sendAirdropToUser}>Send Airdrop</button>
        </div>
    )
}