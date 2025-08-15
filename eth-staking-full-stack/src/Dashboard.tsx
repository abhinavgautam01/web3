import { useReadContract, useWriteContract } from "wagmi"
import { abi } from "./abi"

export default function Dashboard() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _, writeContract } = useWriteContract()

  return (
    <div className="h-screen w-screen flex justify-center items-center">
        <div>
            <button className="mx-2 border rounded px-2 text-2xl" onClick={()=>{
                writeContract({
                    address: '0x51fac1b64f2329519e68595937ea58eb83803c91',
                    abi,
                    functionName: 'stake',
                    args: [BigInt(1000000000000000000)],
                    value: BigInt(1000000000000000000)
                })
            }}>
                Stake
            </button>
            <div>
                <ShowStake />
            </div>
        </div>
      
    </div>
  )
}

function ShowStake(){
    const { data } = useReadContract({
        address: '0x51fac1b64f2329519e68595937ea58eb83803c91',
        abi,
        functionName: 'stakedBalances',
        args: ['0x2966473D85A76A190697B5b9b66b769436EFE8e5'],
    })

    return <div>
        You have staked balance {(data?.toString())} ETH
    </div>
}
