use anchor_lang::{prelude::*};

declare_id!("6KFUiZSwfBfnXRVAtbtuQa2UHmLZXoHojF4MULdKtvxX");

#[program]
pub mod calculator {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, init_num: u32) -> Result<()>{
        ctx.accounts.data_account.counter = init_num;
        Ok(())
    }

    pub fn double(ctx: Context<Double>) -> Result<()> {
        ctx.accounts.data_account.counter = ctx.accounts.data_account.counter * 2;
        Ok(())
    }
    pub fn half(ctx: Context<Half>) -> Result<()> {
        ctx.accounts.data_account.counter = ctx.accounts.data_account.counter / 2;
        Ok(())
    }

    pub fn add(ctx: Context<Add>, num: u32) -> Result<()> {
        ctx.accounts.data_account.counter = ctx.accounts.data_account.counter + num;
        Ok(())
    }

    pub fn subtract(ctx: Context<Subtract>, num: u32) -> Result<()> {
        ctx.accounts.data_account.counter = ctx.accounts.data_account.counter - num;
        Ok(())
    }


}

#[account]
pub struct DataAccountShape {
    counter: u32
}

#[derive(Accounts)]
pub struct Initialize <'info> {
    #[account(init, payer = signer, space = 8+14)]
    pub data_account: Account<'info, DataAccountShape>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Double <'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccountShape>,
    #[account(mut)]
    pub signer: Signer<'info>
}

#[derive(Accounts)]
pub struct Half <'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccountShape>,
    #[account(mut)]
    pub signer: Signer<'info>
}

#[derive(Accounts)]
pub struct Add <'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccountShape>,
    #[account(mut)]
    pub signer: Signer<'info>
}

#[derive(Accounts)]
pub struct Subtract <'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccountShape>,
    #[account(mut)]
    pub signer: Signer<'info>
}
