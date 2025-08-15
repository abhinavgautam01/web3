import { useAccount, useConnect, useDisconnect } from "wagmi"

export default function Appbar() {
    const { address } = useAccount()
  return (
    <div className="flex justify-between p-2 m-2">
        <div className="text-2xl">
            Stakify
        </div>
        <div>
            {!address ? <Connectors />: <Disconnect />}
        </div>
    </div>
  )
}

function Connectors(){
    const { connectors, connect } = useConnect();
    
    return connectors.map((connector)=>(
        <button className="mx-2 border p-2 rounded" key={connector.uid} onClick={()=>connect({connector})}>
            {connector.name}
        </button>
    ))
}

function Disconnect(){
    const { disconnect } = useDisconnect();

    return (
        <button className="mx-2 border p-2 rounded" onClick={()=>disconnect()}>
            Disconnect Wallet
        </button>
    )
}
