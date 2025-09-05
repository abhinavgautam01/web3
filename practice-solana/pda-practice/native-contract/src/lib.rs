use solana_program::{account_info::{next_account_info, AccountInfo}, entrypoint::{ProgramResult}, entrypoint, program::invoke_signed, pubkey::Pubkey, rent::Rent, system_instruction::create_account, sysvar::Sysvar};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let payer_account = next_account_info(iter)?;
    let pda_account = next_account_info(iter)?;
    let payer_pubkey = payer_account.key;
    let system_program = next_account_info(iter)?;

    let (pda, bump) = Pubkey::find_program_address(&[b"user1", payer_pubkey.as_ref()], &program_id);
    assert_eq!(*pda_account.key, pda);

    let rent = Rent::get()?;
    let space: u64 = 16;
    let lamports = rent.minimum_balance(space as usize);

    let ix = create_account(
        &payer_pubkey,
        &pda,
        lamports,
        space,
        &program_id
    );

    let signers_seeds = &[b"user1", payer_pubkey.as_ref(), &[bump]];
    invoke_signed(&ix, &[payer_account.clone(), pda_account.clone(), system_program.clone()], &[signers_seeds])?;

    Ok(())
}