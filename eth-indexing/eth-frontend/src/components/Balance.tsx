import { useAccount, useReadContract } from "wagmi"
import { ABI } from "../abi"

export default function Balance() {
    const { address } = useAccount()
    const { data, isLoading, error } = useReadContract({
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        abi: ABI,
        functionName: "balanceOf",
        args: [address?.toString()]
    })
    if(isLoading){
        return <div>
            Loading..!
        </div>
    }
    if(error){
        return <div>
            Error..!
        </div>
    }
  return (
    <div>
      Balance of {address} is {data ? data.toString() : "0"}
    </div>
  )
}
