import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile(
  "bosR5uk7F2rdZncN49tAgwF45EUjS1QtsKZXaTTMupV.json"
);

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

const nftAddress = publicKey("AdNTyX2oXG4e7i229zvQwmYdwL8Knk33JzwVJudoFj6q");

const transaction = await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: nftAddress }),
  collectionMint: collectionAddress,
  authority: umi.identity,
});

await transaction.sendAndConfirm(umi);

console.log(
  `NFT ${nftAddress} Verified as a member of collection ${collectionAddress} ! See Explorer at ${getExplorerLink(
    "address",
    nftAddress,
    "devnet"
  )}`
);
