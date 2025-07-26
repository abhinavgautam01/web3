import bs58 from "bs58"
// import bip39 from "bip39"
// import ed25519 from "ed25519-hd-key"
// import { Keypair } from "@solana/web3.js"

// const wordlist = bip39.wordlists.english;

// // Partial mnemonic (missing words as empty strings)
// const partial = ["exchange", "disorder", "", "decrease", "wait", "", "pencil", "track", "diamond", "tornado", "gift", "entire"];

// const missingIndices = [2, 5];

// const targetSet = new Set([
//     "8XPovF32Ya1aJcoxbJLNrNGToRwvAQMzkTuQY81pk857",
// ]);

// let checked = 0;
// (async () => {
//   for (const word1 of wordlist) {
//     for (const word2 of wordlist) {
//       const candidate = [...partial];
//       candidate[missingIndices[0]] = word1;
//       candidate[missingIndices[1]] = word2;

//       const phrase = candidate.join(' ');

//       if (!bip39.validateMnemonic(phrase)) continue;

//       const seed = await bip39.mnemonicToSeed(phrase);
//       const derived = ed25519.derivePath("m/44'/501'/0'/1'", seed);
//       const keypair = Keypair.fromSeed(derived.key.slice(0, 32));
//       const pubkey = keypair.publicKey.toBase58();

//       checked++;
//       if (checked % 100000 === 0) {
//         console.log(`Checked ${checked} combinations...`);
//       }

//       if (targetSet.has(pubkey)) {
//         console.log("✅ MATCH FOUND!");
//         console.log("Mnemonic:", phrase);
//         console.log("Public Key:", pubkey);
//         process.exit(0);
//       }
//     }
//   }

//   console.log(`❌ No match found after ${checked} combinations.`);
// })();


const str2 = "61M33n6JayssjygFpQ6dWLPeZmgM19mNiY6kE8VctzPfMYLQj8mEqVu2E9bxa4oAiGGufQwT6c8CpkKtvF21aN1P"
const uint8Array = bs58.decode(str2);

console.log(uint8Array); // prints UInt8Array([...])
