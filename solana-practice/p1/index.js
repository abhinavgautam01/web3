// const crypto = require('crypto');
// function withprefix(prefix, inputStr){
//     let input = 0;
//     while(true){
//       let finalStr = inputStr + input.toString()
//       const hash = crypto.createHash('sha256').update(finalStr).digest('hex')
//       if(hash.startsWith(prefix)){
//         return {
//           finalStr: finalStr,
//           input: input,
//           hash: hash
//         }
//       }
//       input++;
//     }
// }



// const result = withprefix('00000', "100xdevs")

// console.log("result.input", result.input)
// console.log("result.finalStr", result.finalStr)
// console.log("result.hash", result.hash)

// // `
// // harkirat => Raman | Rs 100
// // Ram => Ankit | Rs 10
// // `


// function hextoascii(byteArray){
//   let hexString = ""

//   for(let i = 0; i< byteArray.length; i++){
//     hexString += byteArray[i].toString(16).padStart(2, '0');
//   }
//   return hexString
// }

// const str = "hello"
// const byteStr = new TextEncoder().encode(str);
// const hexstring = hextoascii(byteStr)
// console.log("-------------------------------")
// console.log(hexstring)

// import { Keypair } from "@solana/web3.js";
// import nacl from "tweetnacl";

// const keypair = Keypair.generate()
// // console.log(keypair)

// const publicKey = keypair.publicKey.toBase58()
// const privateKey = keypair.secretKey

// console.log("publicKey: ", publicKey)
// // console.log("privateKey: ", privateKey)

// const message = new TextEncoder().encode("hello world")

// const signature = nacl.sign.detached(message, privateKey);

// console.log("signature: ", signature)
// const verify = nacl.sign.detached.verify(message, signature, keypair.publicKey.toBytes())
// console.log("verify: ", verify)

import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39"
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

const menemonic = "cluster snap garment skin luggage lab wing please girl require elevator marriage"
const seed = mnemonicToSeedSync(menemonic)

for(let i = 0; i < 4; i++){
  const path = `m/44'/501'/${i}'/0'`;
  const deriveSeed = derivePath(path, seed.toString("hex")).key
  const secret = nacl.sign.keyPair.fromSeed(deriveSeed).secretKey;
  console.log(`${i+1} address: ${Keypair.fromSecretKey(secret).publicKey.toBase58()}`)
}