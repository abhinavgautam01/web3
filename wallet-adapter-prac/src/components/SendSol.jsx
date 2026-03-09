import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"
import { useRef } from "react"

export function SendSol(){
  const wallet = useWallet()
  const { connection } = useConnection()
  const ref1 = useRef()
  const ref2 = useRef()

  async function sendSol(){
    const txn = new Transaction().add(SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: ref1.current.value,
      lamports: ref2.current.value * LAMPORTS_PER_SOL
    }))
    await wallet.sendTransaction(txn, connection)
    
    alert(`Successfully Send ${ref2.current.value} SOL to ${ref1.current.value} from ${wallet.publicKey}`)
  }


  return <div>
        <input ref={ref1} type="text" placeholder="Enter address"></input>
        <input ref={ref2} type="number" placeholder="Enter amount"></input>
        
        <button onClick={sendSol}>Send Sol</button>
  </div>
}