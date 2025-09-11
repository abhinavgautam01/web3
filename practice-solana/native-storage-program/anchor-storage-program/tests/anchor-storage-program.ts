import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StorageContractAnchor } from "../target/types/storage_contract_anchor";
import { assert } from "chai";

describe("storage_contract_anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.storageContractAnchor as Program<StorageContractAnchor>;

  it("Is initialized!", async () => {
    const dataAccount = anchor.web3.Keypair.generate();
    const payer = anchor.web3.Keypair.generate();
    //airdrop
    const airdrop_txn = await anchor.getProvider().connection.requestAirdrop(payer.publicKey, 1000000000000000);
    await anchor.getProvider().connection.confirmTransaction(airdrop_txn);

    // Add your test here.
    const tx_init = await program.methods.initialize("Harkirat").accounts({
      dataAccount: dataAccount.publicKey,
      payer: payer.publicKey,
    }).signers([payer, dataAccount]).rpc();

    let dataAccountInfo = await program.account.nameAccount.fetch(dataAccount.publicKey);
    assert(dataAccountInfo.name, "Harkirat");

    await program.methods.update("Harkirat Singh").accounts({
      dataAccount: dataAccount.publicKey,
      payer: payer.publicKey,
    }).signers([payer]).rpc();

    dataAccountInfo = await program.account.nameAccount.fetch(dataAccount.publicKey);
    assert(dataAccountInfo.name, "Harkirat Singh");
  });
});
