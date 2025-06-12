import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile("bosR5uk7F2rdZncN49tAgwF45EUjS1QtsKZXaTTMupV.json");

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log("Loaded user: ", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionAddress = publicKey(
  "76qMMEZn7y8SwgBnz2wcwtZogKGqWxh95UDUGPMAP8Vo"
);

console.log("Creating NFT");

const mint = generateSigner(umi);

console.log("Mint Address :", mint.publicKey)

const transaction = await createNft(umi, {
  mint: mint,
  name: "Talwiinder",
  symbol: "👺",
  uri: "https://raw.githubusercontent.com/abhinavgautam01/web3/refs/heads/main/new-nft/nft_metadata.json",
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectionAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi, {
    confirm: {
        commitment: "finalized",
    }
});

await new Promise((resolve) => setTimeout(resolve, 5000));

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(
  `Created NFT! Address is ${getExplorerLink(
    "address",
    createdNft.mint.publicKey,
    "devnet"
  )}`
);
