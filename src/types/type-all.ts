import { TICKER } from "..";

export type Bids = {
    userId:number,
    price:number,
    qty:number,
}
export type User = {
    userId:number,
    balances:{
        "TATA":number,
        balance:number,
    }
}
export type Asks = Bids;