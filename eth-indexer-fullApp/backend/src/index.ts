import express from "express";
// import pg from "pg";
import { HDNodeWallet } from "ethers";
import { mnemonicToSeedSync } from "bip39";
import { MNEMONIC } from "./config";
import cors from "cors";

const app = express();
const seed = mnemonicToSeedSync(MNEMONIC);
app.use(express.json())
app.use(cors());

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userId = 1;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(`m/44'/60'/${userId}'/0`);
  console.log(child);

  res.json({
    userId,
  });
});

app.get("/depositAddress/:userId", (req, res) => {

});

app.listen(3000, ()=>{
    console.log("Listening on http://localhost:3000")
})
