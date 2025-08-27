use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint::{ProgramResult}, instruction::{AccountMeta, Instruction}, msg, program::invoke, pubkey::Pubkey, entrypoint
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
)-> ProgramResult {
    let mut iter = accounts.iter();
    let cpi_data_account = next_account_info(&mut iter)?;
    let double_contract_address = next_account_info(&mut iter)?;

    let instruction = Instruction{
        program_id: *double_contract_address.key,
        accounts: vec![AccountMeta{
            is_signer: true,
            is_writable: true,
            pubkey: *cpi_data_account.key
        }],
        data: vec![]
    };

    invoke(&instruction, &[cpi_data_account.clone()]);
    Ok(())
}