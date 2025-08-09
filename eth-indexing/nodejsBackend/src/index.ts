import { id, JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Jdx7kejFF8h5mR4WqH0Ji")

async function pollBlock (blockNumber: number) {
    const logs = await provider.getLogs({
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        fromBlock: blockNumber,
        toBlock: blockNumber,
        topics: [id("Transfer(address,address,uint256)")]
    });
    console.log("Logs: ", logs)
}

pollBlock(23104073);