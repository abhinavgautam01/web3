use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    entrypoint
};

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    count: u32
}

#[derive(BorshSerialize, BorshDeserialize)]
enum CounterInstructions {
    Increment(u32),
    Decrement(u32)
}

entrypoint!(counter_contract);

pub fn counter_contract(
    progran_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
)-> ProgramResult{
    let acc = next_account_info(&mut accounts.iter())?;
    let mut counter = Counter::try_from_slice(&acc.data.borrow())?;

    match CounterInstructions::try_from_slice(instruction_data)? {
        CounterInstructions::Increment(amount) => {
            counter.count += amount;
        }
        CounterInstructions::Decrement(amount) => {
            counter.count -= amount;
        }
    }

    counter.serialize(& mut *acc.data.borrow_mut())?;

    msg!("Counter updated to : {}", counter.count);

    Ok(())
}