// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VestingIDL from '../target/idl/vesting.json'
import type { Vesting } from '../target/types/vesting'

// Re-export the generated IDL and type
export { Vesting, VestingIDL }

// The programId is imported from the program IDL.
export const VESTING_PROGRAM_ID = new PublicKey(VestingIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getVestingProgram(provider: AnchorProvider, address?: PublicKey): Program<Vesting> {
  return new Program({ ...VestingIDL, address: address ? address.toBase58() : VestingIDL.address } as Vesting, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getVestingProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('EzY7ZEC6EyzHDtqWs3tmdBbUc5LcHccDjseAyLUFYgz9')
    case 'mainnet-beta':
    default:
      return VESTING_PROGRAM_ID
  }
}
