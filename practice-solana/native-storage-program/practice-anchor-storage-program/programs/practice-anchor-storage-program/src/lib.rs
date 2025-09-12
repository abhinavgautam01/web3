use anchor_lang::prelude::*;

declare_id!("FGH7oV7XbmPtpW1jbbgAVXnoTwZnj6THABpfYR3D8YTk");

#[program]
pub mod practice_anchor_storage_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _name: String) -> Result<()> {
        ctx.accounts.name_account.name = _name;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, _name: String) -> Result<()> {
        ctx.accounts.name_account.name = _name;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + NameStorage::INIT_SPACE)]
    pub name_account: Account<'info, NameStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub name_account: Account<'info, NameStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct NameStorage {
    #[max_len(20)]
    pub name: String
}