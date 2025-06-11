use anchor_lang::prelude::*;
use anchor_spl::{token::Mint, token_interface::{TokenAccount, TokenInterface}};

pub fn transfer_tokens<'info>(
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    mint: &InterfaceAccount<'info, Mint>,
    authority: &Signer<'info>,
    token_program: &Interface<'info, TokenInterface>
)-> Result<()>{
    
    Ok(())
}