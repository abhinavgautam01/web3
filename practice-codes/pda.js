import { PublicKey }from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

// Replace these with your actual values
const userAddress = new PublicKey('2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN');
const tokenMintAddress = new PublicKey('56wGq2q3QAMDiuh9TcN3rcp2LWr5fvhNGy4jxhejrR9f');

// Derive the associated token address
const getAssociatedTokenAddress = (mintAddress, ownerAddress) => {
    return PublicKey.findProgramAddressSync(
        [
            ownerAddress.toBuffer(),
            TOKEN_2022_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
};

const [associatedTokenAddress, bump] = getAssociatedTokenAddress(tokenMintAddress, userAddress);
console.log(`Associated Token Address: ${associatedTokenAddress.toBase58()}, bump: ${bump}`);

