import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PracticeAnchorStorageProgram } from "../target/types/practice_anchor_storage_program";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { assert } from "chai";

describe("practice-anchor-storage-program", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .practiceAnchorStorageProgram as Program<PracticeAnchorStorageProgram>;
    
    it("Is initialized!", async () => {
      // Setting up
      const name_account = anchor.web3.Keypair.generate();
      const payer = anchor.web3.Keypair.generate();
    
      const airdrop_transaction = await anchor
        .getProvider()
        .connection.requestAirdrop(payer.publicKey, 10 * LAMPORTS_PER_SOL);
      await anchor.getProvider().connection.confirmTransaction(airdrop_transaction);
      
      // initailize request
      await program.methods
      .initialize("Golu")
      .accounts({
        nameAccount: name_account.publicKey,
        signer: payer.publicKey,
      })
      .signers([payer, name_account])
      .rpc();
      
      let name_account_info = await program.account.nameStorage.fetch(
        name_account.publicKey
      );
      assert(name_account_info.name, "Golu");
    });

    it("updated!", async () => {
      // Setting up
    const name_account = anchor.web3.Keypair.generate();
    const payer = anchor.web3.Keypair.generate();
  
    const airdrop_transaction = await anchor
      .getProvider()
      .connection.requestAirdrop(payer.publicKey, 10 * LAMPORTS_PER_SOL);
    await anchor.getProvider().connection.confirmTransaction(airdrop_transaction);
    
      // Initializing again for update test
    await program.methods
      .initialize("Golu")
      .accounts({
        nameAccount: name_account.publicKey,
        signer: payer.publicKey,
      })
      .signers([payer, name_account])
      .rpc();
      
      // update request
    await program.methods
      .update("Abhinav Gautam")
      .accounts({
        nameAccount: name_account.publicKey,
        signer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    let name_account_info = await program.account.nameStorage.fetch(
      name_account.publicKey
    );
    assert(name_account_info.name, "Abhinav Gautam");
  });
});
