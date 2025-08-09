import { useReadContract } from "wagmi"
import { ABI } from "../abi"

export default function TotalSupply() {
    const { data, isLoading, error} = useReadContract({
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        abi: ABI,
        functionName: "totalSupply",
    })
    if(isLoading){
        return <div>
            Loading..!
        </div>
    }
    if(error){
        return <div>
            Error...!
        </div>
    }
  return (
    <div>
      Total Supply is : {data?.toString()}
    </div>
  )
}
