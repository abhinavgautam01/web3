import * as ed from "@noble/ed25519";
import bs58 from "bs58";

function uint8ArrayToBase58(uint8Array) {
  return bs58.encode(uint8Array);
}

async function main() {
  //   const privKey = ed.utils.randomPrivateKey();
  const test = new Uint8Array([
    74, 41, 132, 133, 235, 252, 253, 66, 119, 126, 172, 66, 86, 19, 173, 211,
    158, 165, 54, 6, 2, 72, 50, 28, 47, 41, 182, 13, 38, 51, 211, 222,
  ]);

  const pubKey = await ed.getPublicKeyAsync(test);
  console.log("pubKey: ", pubKey);
  console.log("pubkey: ", uint8ArrayToBase58(pubKey));

  const message = new TextEncoder().encode("hello world");
  const signature = await ed.signAsync(message, test);
  console.log("signature: ", uint8ArrayToBase58(signature))
//   const isValid = await ed.verifyAsync(signature, message, pubKey);
//   console.log("isValid: ", isValid);
}

main();
