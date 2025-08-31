import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import { assert } from "chai";

describe("calculator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.calculator as Program<Calculator>;
  const dataAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize(10)
    .accounts({
      dataAccount: dataAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .signers([dataAccount])
    .rpc()
    
    const account = await program.account.dataAccountShape.fetch(dataAccount.publicKey)
    assert(account.counter == 10);
  });

  it("Instruction Double", async () => {
    const tx = await program.methods.double()
    .accounts({
      dataAccount: dataAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey
    })
    .rpc()

    const account = await program.account.dataAccountShape.fetch(dataAccount.publicKey)
    assert(account.counter == 20);
  })

  it("Instruction Half", async ()=> {
    const tx = await program.methods.half()
    .accounts({
      dataAccount: dataAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey
    })
    .rpc()

    const account = await program.account.dataAccountShape.fetch(dataAccount.publicKey);
    assert(account.counter == 10)
  })

  it("Instruction Add", async ()=> {
    const tx = await program.methods.add(7)
    .accounts({
      dataAccount: dataAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey
    })
    .rpc()

    const account = await program.account.dataAccountShape.fetch(dataAccount.publicKey);
    assert(account.counter == 17)
  })

  it("Instruction Subtract", async ()=> {
    const tx = await program.methods.subtract(5)
    .accounts({
      dataAccount: dataAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .rpc()

    const account = await program.account.dataAccountShape.fetch(dataAccount.publicKey);
    assert(account.counter == 12);
  })
});
