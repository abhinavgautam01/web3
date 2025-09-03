use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint::{ProgramResult}, entrypoint, msg, program::invoke, program_error::ProgramError, pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar
};

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter{
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum CounterInstruction {
    Initialize(u32),
    Double,
    Half
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CounterInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;
    match instruction{
        CounterInstruction::Initialize(_number)=> {
            msg!("Initializing Counter Value");

            let mut iter = accounts.iter();
            let data_account = next_account_info(&mut iter)?;
            let payer = next_account_info(&mut iter)?;
            let system_program = next_account_info(&mut iter)?;

            if !payer.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let space: usize = 4;
            let rent = Rent::get()?;
            let lamports = rent.minimum_balance(space);

            let create_account_ix = system_instruction::create_account(
                payer.key,
                data_account.key,
                lamports,
                space as u64,
                program_id);

            invoke(&create_account_ix, &[payer.clone(), data_account.clone(), system_program.clone()])?;
            let counter_state = Counter{ count: _number };
            counter_state.serialize(&mut * data_account.data.borrow_mut())?;
        }
        CounterInstruction::Double => {
            msg!("Doubling Counter Value");
            let mut iter = accounts.iter();
            let data_account = next_account_info(&mut iter)?;

            if data_account.owner != program_id{
                return Err(ProgramError::IncorrectProgramId);
            }

            let mut counter_state = Counter::try_from_slice(&data_account.data.borrow())?;
            counter_state.count = counter_state.count * 2;
            counter_state.serialize(&mut *data_account.data.borrow_mut())?;
        }
        CounterInstruction::Half => {
            msg!("Halving Counter Value");

            let mut iter = accounts.iter();
            let data_account = next_account_info(&mut iter)?;

            if data_account.owner != program_id{
                return Err(ProgramError::IncorrectProgramId);
            }

            let mut counter_state = Counter::try_from_slice(&data_account.data.borrow())?;
            counter_state.count = counter_state.count / 2;
            counter_state.serialize(&mut * data_account.data.borrow_mut())?; 
        }
    }
    Ok(())
}