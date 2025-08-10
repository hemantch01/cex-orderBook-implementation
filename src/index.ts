import express,{Request,Response} from "express";
import { Asks, Bids,User} from "./types/type-all";

const  PORT = 3000;
export const  TICKER = "TATA";
const app = express();
app.use(express.json());

const bids:Bids[]=[];
const asks:Asks[]=[];
const users:User[]=[
    {
        userId:1,
        balances:{
            [TICKER]:10,
            balance:50000,
        }
    },
     {
        userId:1,
        balances:{
            [TICKER]:10,
            balance:50000,
        }
    }

];

function flipBalance(userid1:number,price:number,userid2:number,qty:number,){
let user1 = users.find((x)=>x.userId===userid1);
let user2 = users.find((x)=>x.userId===userid2);
if(user1){
    user1.balances.balance+=qty*price;
    user1.balances.TATA -= qty; 
}
if(user2){
    user2.balances.balance-=qty*price;
    user2.balances.TATA += qty; 
}
}

function matchOrders(price:number,qtyFromUser:number,side:string,userId:number):number{
   // user send the price it wants to sell or buy and qty he wants to sell 
  let qty = qtyFromUser;
   if(side==="bids"){
    // iterate over asks
    for(let i=asks.length-1;i>=0;i--){
        if(qty===0)return 0;
        if(asks[i].price>price){
            break;
        }
        else {
            // transaction must perform 
            if(asks[i].qty>qty){
                asks[i].qty-=qty;
                flipBalance(asks[i].userId,asks[i].price,userId,qty)// this will change the values after matching 
                return 0;// all the things of user filled
            }
            else{
                qty-=asks[i].qty;
               flipBalance(asks[i].userId,asks[i].price,userId,asks[i].qty); 
                asks.pop();
            }
        }
    } 
   }
   else {
    // the side is asks
    for(let i=bids.length-1;i>=0;i--){
        if(bids[i].price>price){
            break;
        }
        else{
            if(bids[i].qty>qty){
                // completly abosrbe qty
                bids[i].qty-=qty;
                flipBalance(bids[i].userId,price,userId,qty);
                return 0;
            }
            else{
                // remove the bid from the bids array
                qty-=bids[i].qty;
                flipBalance(bids[i].userId,price,userId,bids[i].qty);
                bids.pop();
            }
        }
    }
   }
}

const orders = (req:Request,res:Response)=>{
// first take the important thing from users
const {userId,side,price,qty} = req.body;
const leftQty = matchOrders(price,qty,side,userId);
if(leftQty === 0){
    res.json({
        filledQty:qty,
    })
}

// now some orders are left here 
if(side==="bids"){
    bids.push({
        userId,
        price,
        qty:leftQty,
    });
    bids.sort((a,b)=>a.price<b.price?1:-1);
}
else {
    asks.push({
        userId,
        price,
        qty:leftQty
    });
    asks.sort((a,b)=>b.price>a.price?1:-1);
}

res.json({
    filledqty:qty-leftQty,
})
    
}

const currentDepth = (req:Request,res:Response)=>{
    // parse the data of current bids and asks and return the user data
    const cumulatedAsks =new Map<number,number>(); 
    const cumulatedBids = new Map<number,number>();
    for(let ele of asks){
        let ask = cumulatedAsks.get(ele.price)||0;
        cumulatedAsks.set(ele.price,ask+ele.qty);  
    }
    for(let ele of asks){
        let ask = cumulatedBids.get(ele.price)||0;
        cumulatedBids.set(ele.price,ask+ele.qty);  
    }
    res.json({
        asks:cumulatedAsks,
        bids:cumulatedBids,
    })
}

const checkBalance = (req:Request,res:Response)=>{
const user = req.params.userId;
    const userind= users.find((u)=>u.userId===Number(user));

if(!userind){
    res.json({
        msg:"user doesn't exist!",
    })
}
else{
    res.json({
        balance:userind.balances,
    })
}
}

// different routes
app.get("/order", orders);
app.get("/depth", currentDepth);
app.get("/balance/:userId", checkBalance);

app.listen( PORT , ()=>{
console.log(`app is listening on port ${PORT}`);
})