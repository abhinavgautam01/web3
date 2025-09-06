use anchor_lang::{prelude::*, };

declare_id!("69TU8FT8aj9mitCaWQs4db2WPudX59sHBy7KuXFSVDtH");

// Points rate: 1 point per SOL per day (1 point per 1e9 lamports per 86400 seconds)
const POINTS_PER_SOL_PER_DAY: u64 = 1_000_000; // Using micro-points for precision
const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
const SECONDS_PER_DAY: u64 = 86_400;


#[program]
pub mod creating_pda {
    use anchor_lang::system_program;

    use super::*;

    pub fn create_pda_account(ctx: Context<CreatePdaAccount>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        pda_account.owner = ctx.accounts.signer.key();
        pda_account.staked_amount = 0;
        pda_account.total_points = 0;
        pda_account.last_updated_time = clock.unix_timestamp;
        pda_account.bump = ctx.bumps.pda_account;

        msg!("Staking PDA account created successfully");
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount>0, StakeError::InvalidAmount);

        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        update_points(pda_account, clock.unix_timestamp)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), system_program::Transfer{
                from: ctx.accounts.user.to_account_info(),
                to:  pda_account.to_account_info()
            }
        );

        system_program::transfer(cpi_context, amount)?;

        pda_account.staked_amount = pda_account.staked_amount.checked_add(amount)
        .ok_or(StakeError::Overflow)?;

        msg!("Staked {} lamports. Total staked: {}, Total points: {}", amount, pda_account.staked_amount, pda_account.total_points / 1_000_000);
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        require!(pda_account.staked_amount >= amount, StakeError::InsufficientStake);
        
        // Update points before changing staked amount
        update_points(pda_account, clock.unix_timestamp)?;
        
        // Transfer SOL from PDA back to user
        let user_key = ctx.accounts.user.key();

        let seeds: &[&[u8]] = &[
            b"user1",
            user_key.as_ref(),
            &[pda_account.bump],
        ];

        let signer = &[seeds];
        
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: pda_account.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );
        system_program::transfer(cpi_context, amount)?;
        
        // Update staked amount
        pda_account.staked_amount = pda_account.staked_amount.checked_sub(amount)
            .ok_or(StakeError::Underflow)?;
        
        msg!("Unstaked {} lamports. Remaining staked: {}, Total points: {}", amount, pda_account.staked_amount, pda_account.total_points / 1_000_000);
        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimPoints>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        // Update points to current time
        update_points(pda_account, clock.unix_timestamp)?;
        
        let claimable_points = pda_account.total_points / 1_000_000; // Convert micro-points to points
        
        msg!("User has {} claimable points", claimable_points);
        
        // Reset points after claiming (or you could track claimed vs unclaimed separately)
        pda_account.total_points = 0;
        
        Ok(())
    } 
}

fn update_points(pda_account: &mut StakeAccount, current_time: i64)-> Result<()> {
    let time_elapsed = current_time.checked_sub(pda_account.last_updated_time)
    .ok_or(StakeError::InvalidTimeStamp)? as u64;

    if time_elapsed > 0 && pda_account.staked_amount > 0 {
        let new_points = calculate_points_earned(pda_account.staked_amount, time_elapsed)?;
        pda_account.total_points = pda_account.total_points.checked_add(new_points)
            .ok_or(StakeError::Overflow)?;
    }

    pda_account.last_updated_time = current_time;
    Ok(())
}

fn calculate_points_earned(staked_amount: u64, time_elapsed_seconds: u64) -> Result<u64> {
    let points = (staked_amount as u128)
        .checked_mul(time_elapsed_seconds as u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(POINTS_PER_SOL_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(LAMPORTS_PER_SOL as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(SECONDS_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?;
    
    Ok(points as u64)
}

#[derive(Accounts)]
pub struct CreatePdaAccount <'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"user1", signer.key().as_ref()],
        space = 8 + StakeAccount::INIT_SPACE,
        bump
    )]
    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info>{
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user1", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds =[b"user1", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct ClaimPoints<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user1", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>
}

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub total_points: u64,
    pub last_updated_time: i64,
    pub bump: u8
}

#[error_code]
pub enum StakeError {
    #[msg("Unautorized access")]
    Unauthorized,
    #[msg("Invalid amount entered")]
    InvalidAmount,
    #[msg("Invalid timestamp")]
    InvalidTimeStamp,
    #[msg("Insufficient staked amount")]
    InsufficientStake,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}