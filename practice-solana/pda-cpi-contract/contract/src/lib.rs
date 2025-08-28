use solana_program::{
    account_info::{ next_account_info, AccountInfo }, entrypoint::{ ProgramResult }, msg, program::invoke_signed, pubkey::Pubkey, system_instruction::create_account, entrypoint
};

entrypoint!(process_instruction);

pub fn process_instruction (
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut iter = &mut accounts.iter();
    let user_acc = next_account_info(iter)?;
    let pda = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    let seeds = &[user_acc.key.as_ref(), b"user"];
    let (pda_pub_key, bump) = Pubkey::find_program_address(seeds, &program_id);

    let instruction = create_account(user_acc.key, pda.key, 100_000_000, 14, program_id);

    let signer_seeds = &[user_acc.key.as_ref(), b"user", &[bump]];
    invoke_signed(&instruction, accounts, &[signer_seeds])?;

    Ok(())
}