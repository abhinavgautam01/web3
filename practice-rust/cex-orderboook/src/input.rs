use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateOrderInput {
    pub price: u32,
    pub quantity: u32,
    pub user_id: String,
    pub side: Side
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone, Copy)]
pub enum Side {
    Buy,
    Sell
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DeleteOrder {
    pub order_id: String
}