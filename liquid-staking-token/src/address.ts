import "dotenv/config";

const secretKeyString = process.env.SECRET_KEY;
const secretKeyArray: number[] = JSON.parse(secretKeyString!);

export const PRIVATE_KEY = secretKeyArray
export const PUBLIC_KEY = "2bh1QQoc8QcKd2gMhsexQuJQWHrhhS2gnLfgNz2XnmuN";

export const TOKEN_MINT_ADDRESS = "56wGq2q3QAMDiuh9TcN3rcp2LWr5fvhNGy4jxhejrR9f";