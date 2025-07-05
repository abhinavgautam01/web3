import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

// const mnemonic = generateMnemonic();
const mnemonic = "morning juice between exhibit fantasy duck attitude tissue index sheriff stand enact";
const seed = mnemonicToSeedSync(mnemonic);
const a = seed.toString("hex")
console.log("mnemonic: ", mnemonic)
console.log("seed is: ", a)
for (let i = 0; i < 4; i++) {
  const path = `m/44'/501'/${i}'/0'`; // This is the derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}