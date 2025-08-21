use::borsh::{ BorshDeserialize, BorshSerialize};
use::solana_program::{
    account_info::{
        next_account_info,
        AccountInfo
    },
    msg,
    pubkey::Pubkey,
    entrypoint::ProgramResult,
    entrypoint
};

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum CounterInstruction{
    Increment(u32),
    Decrement(u32)
}

entrypoint!(process_instruction);

pub fn process_instruction (
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
)-> ProgramResult{
    let account = next_account_info(&mut accounts.iter())?;

    let mut counter = Counter::try_from_slice(& account.data.borrow())?;

    match CounterInstruction::try_from_slice(instruction_data)? {
        CounterInstruction::Increment(_amount) => {
            msg!("Counter incremented.");
            counter.count += _amount;
        }
        CounterInstruction::Decrement(_amount) => {
            msg!("Counter decremented.");
            counter.count -= _amount;
        }
    }

    counter.serialize(& mut *account.data.borrow_mut())?;
    msg!("Counter updated.");

    Ok(())
}