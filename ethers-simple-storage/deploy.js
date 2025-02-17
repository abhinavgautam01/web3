const { JsonRpcProvider, Wallet, ContractFactory } = require("ethers");
const fs = require("fs");
const dotenv = require("dotenv").config();

// Address: 0xeB7096546e9E418089a016b6Aa6a245F21Dde606
async function main() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);

  // const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJsonKey = fs.readFileSync("./.encryptedKey.json", "utf-8");
  let wallet = Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.PRIVATE_KEY_PASSWORD,
  );
  wallet = wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8",
  );

  const contractFactory = new ContractFactory(abi, binary, wallet);
  console.log("Deploying your Contract..!");

  const contract = await contractFactory.deploy();
  // console.log("contract: ", contract);
  await contract.deploymentTransaction().wait(1);
  const currentFavoriteNumber = await contract.retrieve();
  console.log("currentFavoriteNumber: ", currentFavoriteNumber.toString());
  const transactionResponse = await contract.store("3");
  const transactionReciept = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`updatedFavoriteNumber: ${updatedFavoriteNumber}`);

  // console.log("Deploying with only transaction data..!");
  // const nonce = await wallet.getNonce()
  // const tx ={
  //   nonce: nonce,
  //   gasPrice: 20000000000,
  //   gasLimit: 1000000,
  //   to: null,
  //   value: 0,
  //   data:  ,
  //   chainId: 1337,
  // };
  // const sendTxResponse = await wallet.sendTransaction(tx);
  // await sendTxResponse.wait(1);
  // console.log("sendTxResponse: ",sendTxResponse);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
