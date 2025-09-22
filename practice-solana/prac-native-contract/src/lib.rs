use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct DataAccount {
    num: u32
}
#[derive(BorshSerialize, BorshDeserialize)]
pub enum Instructions {
    Initialize(u32),
    Add(u32),
    Subtract(u32),
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let data_account = next_account_info(iter)?;
    let payer = next_account_info(iter)?;
    let mut data = DataAccount::try_from_slice(& data_account.data.borrow())?;

    match Instructions::try_from_slice(instruction_data)? {
        Instructions::Initialize(num) => {
            data.num = num;
        }
        Instructions::Add(num) => {
            data.num = data.num + num ;
        }
        Instructions::Subtract(num) => {
            data.num = data.num - num ;
        }
    }

    data.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}