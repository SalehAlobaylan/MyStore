import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Product } from "./database/models/product.entity";
import { Order } from "./database/models/order.entity";

const app = express();
const port = 3000;
dotenv.config()

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:4200" // allowing Anuglar port to fetch APIs
    })
)

app.post("/api/orders", async (req,res) => {
    const { fullName, address, creditCardLast4, total, products } = req.body;

    const order = new Order();
    order.fullName = fullName;
    order.address = address;
    order.creditCardLast4 = creditCardLast4;
    order.total = total;
    order.products = products;

    try {
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Error saving order" });
    }
});