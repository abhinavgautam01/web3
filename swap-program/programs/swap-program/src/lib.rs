pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("4encR5xGBpVKS87HM7biCasyBi9Aj2AJNK4sCAYrQ1cQ");

#[program]
pub mod swap_program {
    use super::*;

    pub fn make_offer(context: Context<MakeOffer>) -> Result<()> {
        instructions::make_offer::send_offered_tokens_to_vault()?;
        instructions::make_offer::save_offer()?;

    }
}
