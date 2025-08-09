import { useWriteContract } from "wagmi"
import { ABI } from "../abi";

export default function AllowUSDT() {
    const { data, writeContract } = useWriteContract();

    async function submit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        writeContract({
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            abi: ABI,
            functionName: "approve",
            args: ["0x53Fdc83Bf80Ce22901fae24DE0D4Db06Dab865b5", BigInt(10000000)]
        })
    }

  return (
    <form onSubmit={submit}>
        <input name="tokenId" placeholder="Amount" required />
        <button type="submit">Approve</button>
        {data && <div>Transaction Hash: { data }</div>}
    </form>
  )
}
