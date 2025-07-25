import express, { Request, Response } from "express";
import { burnTokens, mintTokens, sendNativeTokens } from "./mintTokens";
import { PUBLIC_KEY } from "./address";

// const HELIUS_RESPONSE = {
//     "description": "2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN transferred 100 SOL to 2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN.",
//     "nativeTransfers": [ {
//         "amount": 100000000000,
//         "fromUserAccount": "2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN",
//         "toUserAccount": "2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN"
//     } ]
// }

const app = express();
app.use(express.json());
const vault = PUBLIC_KEY;

//@ts-ignore
app.post("/helius", async (req: Request, res: Response) => {
  const HELIUS_RESPONSE = req.body;

  const incomingTxn = HELIUS_RESPONSE.nativeTransfers?.find(
    (x: any) => x.toUserAccount === vault
  );

  if (!incomingTxn) {
    return res.status(200).send("Address Not matched to Vault address..!");
  }

  const fromAddress = incomingTxn.fromUserAccount;
  const toAddress = incomingTxn.toUserAccount;
  const amount = incomingTxn.amount;

  const type = "received_native_sol";
  try {
    if (type === "received_native_sol") {
        await mintTokens(fromAddress, amount);
    } else {
        await burnTokens(fromAddress, amount);
        await sendNativeTokens(toAddress, amount);
    }
    res.send("Transaction successful");
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});