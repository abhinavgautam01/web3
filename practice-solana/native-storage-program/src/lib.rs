use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::AccountInfo, entrypoint::{ProgramResult}, entrypoint, program::invoke, program_error::ProgramError, pubkey::Pubkey, system_instruction};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct NameAccount {
    pub name: String,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub enum NameInstruction {
    Initialize(String),
    Update(String)
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // let iter = accounts.iter();
    let [payer, name_account, system_program_info] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    match NameInstruction::try_from_slice(instruction_data)? {
        NameInstruction::Initialize(name) => {
            let create_ix = system_instruction::create_account(payer.key, name_account.key, 1000000000, 82, program_id);

            invoke(&create_ix, &[
                payer.clone(),
                name_account.clone(),
                system_program_info.clone()
            ])?;

            let name_account_data = NameAccount{ name };
            name_account_data.serialize(&mut *name_account.data.borrow_mut())?;
        }

        NameInstruction::Update(update_name) => {
            let mut name_account_data = NameAccount::try_from_slice(&name_account.data.borrow())?;
            name_account_data.name = update_name;
            name_account_data.serialize(&mut *name_account.data.borrow_mut())?;
        }
    }

    Ok(())
}