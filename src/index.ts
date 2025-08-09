import express,{Request,Response} from "express";
import { Asks, Bids } from "./types/type-all";
const  PORT = 3000;
const app = express();
app.use(express.json());

const bids:Bids[]=[];
const asks:Asks[]=[];

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



// different routes
app.get("/order", orders);

app.listen( PORT , ()=>{
console.log(`app is listening on port ${PORT}`);
})