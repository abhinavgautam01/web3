import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { Voting } from "@/../anchor/target/types/voting"
import { BN, Program } from "@coral-xyz/anchor"

const IDL = require("@/../anchor/target/idl/voting.json")

export const OPTIONS = GET

export async function GET(request: Request){
    const actionMetadata: ActionGetResponse = {
        icon: "https://t3.ftcdn.net/jpg/01/71/54/62/360_F_171546265_DV8E3F9ObHCvPjOWN6Mhr08DXwKrybR1.jpg",
        title: "Vote for your favorite type of peanut butter!",
        description: "Vote between crunchy and smooth peanut butter.",
        label: "Vote",
        links: {
            actions: [
                {
                    type: "post",
                    label: "Vote for Crunchy",
                    href: "/api/vote?candidate=Crunchy",
                },
                {
                    type: "post",
                    label: "Vote for Smooth",
                    href: "/api/vote?candidate=Smooth",
                },

            ]
        }
    }
    return Response.json(actionMetadata, {headers: ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request){
    
    const url = new URL(request.url)
    const candidate = url.searchParams.get("candidate");
    
    if(candidate != "Crunchy" && candidate != "Smooth"){
        return Response.json({ error: "Invalid Candidate" }, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
          });
    }
    
    const connection = new Connection("http://127.0.0.1:8899", "confirmed")
    const program: Program<Voting> = new Program(IDL, {connection})

    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account)
    }catch(error){
        return Response.json({ error: `Invalid Account: ${error}` }, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
          });
    }

    const instruction = await program.methods.vote(candidate, new BN(1)).accounts({
        signer: voter
    }).instruction()

    const blockhash = await connection.getLatestBlockhash()

    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(instruction)

    const response = await createPostResponse({
        fields: {
            type: "transaction",
            transaction: transaction
        }
    })

    return Response.json(response, {headers: ACTIONS_CORS_HEADERS})

}