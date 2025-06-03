import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { BankrunProvider } from 'anchor-bankrun'
import { Voting } from 'anchor/target/types/voting'
import { startAnchor } from 'solana-bankrun'

const IDL = require('../target/idl/voting.json')

const votingAddress = new PublicKey('8W1rbyEht6nEMnYdF4EAD4PbXDwoxjM9MWqs2ZPFW78B')

describe('Voting', () => {
  let context;
  let provider;
  anchor.setProvider(anchor.AnchorProvider.env())
  let votingProgram = anchor.workspace.Voting as Program<Voting>;

  beforeAll(async () => {
    /*context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], [])

    provider = new BankrunProvider(context)

    votingProgram = new Program<Voting>(IDL, provider)*/
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        'What is your favorite type of peanut butter..!?',
        new anchor.BN(0),
        new anchor.BN(1781246478),
      )
      .rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress)

    expect(poll.pollId.toNumber()).toEqual(1)
    expect(poll.description).toEqual('What is your favorite type of peanut butter..!?')
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  })

  it('initialize candidate', async () => {
    await votingProgram.methods.intializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.intializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress,
    )

    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate)
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0)
    
    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    )
    
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate)
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0)
    
  })
  
  it('vote', async () => {
    await votingProgram.methods.vote(
      "Smooth",
      new anchor.BN(1),
    ).rpc()
    
    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    )
    
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate)
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1)
  })
})
