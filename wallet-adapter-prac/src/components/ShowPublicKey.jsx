import { useWallet } from "@solana/wallet-adapter-react"

export function ShowPublicKey(){
  const wallet = useWallet()
  return <div>
    {wallet.publicKey? `Connected with ${wallet.publicKey}`: <></>}
  </div>
}