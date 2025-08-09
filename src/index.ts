import express,{Request,Response} from "express";
import { Asks, Bids,User} from "./types/type-all";

const  PORT = 3000;
const  TICKER = "TATA";
const app = express();
app.use(express.json());

const bids:Bids[]=[];
const asks:Asks[]=[];
const users:User[]=[];

function matchOrders(price:number,qty:number,side:string,userId:number):number{
    // match logic
    return 1;
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
        balance:userind.balance,
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