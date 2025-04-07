import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DataSource } from "typeorm"
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


const database = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(`${process.env.POSTGRES_PORT}`),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [Order, Product], // Database tables
    synchronize: true, // Set to false in production
    ssl: {
        rejectUnauthorized: false // For AWS RDS SSL connection
    }
    
});

database.initialize()
.then(() => {
    console.log("Connected to PostgreSQL");
    
    app.post("/api/orders", async (req,res) => {
        try{

        const {fullName, address, creditCard, total, orderDate, products} = req.body;

        if (!fullName || !address || !creditCard || !total || !products) {
            return res.status(400).json({ 
              error: "Missing required fields (fullName, address, creditCard, total, products)" 
            });
          }

        const orderRepository = database.getRepository(Order);
        const productRepository = database.getRepository(Product);

        const creditCardLast4 = creditCard.slice(-4);

        // Find products id to match our cart and could change it to use mongoose instead 
        const productEntities = await productRepository.findBy({
            id: products})

        const newOrder = orderRepository.create({
            fullName, 
            address, 
            creditCardLast4, 
            products: productEntities, 
            total, 
            orderDate
        })

        const savedOrder = await orderRepository.save(newOrder);

        res.status(200).json({
            message: "Order created successfully",
            orderId: savedOrder.id,
            order: savedOrder
        })

        }catch(err){
            console.error("Error Creating Order", err);
            res.status(500).json({error: "Error creating order"})

        }
    });

    app.get("/api/orders", async (req,res) => {
        try{
            const orderRepository = database.getRepository(Order);
            const orders = await orderRepository.find({
                relations: ["products"]
            });
            res.status(200).json(orders);
        }catch(err){
            res.status(500).json({error: "Error fetching orders"})
        }
    });

    app.get("/api/orders/:orderId", async (req,res) => {
        try{
            const orderId = Number(req.params.orderId);
            if (isNaN(orderId)) {
              return res.status(400).json({ error: "Invalid order ID" });
            }

            const orderRepository = database.getRepository(Order);
            const order = await orderRepository.findOne({
                where: { id: orderId},
                relations: ["products"]
            })
            if (order) {
                res.json(order);
              } else {
                res.status(404).json({ error: "Order not found" });
              }
        }catch(err){
            res.status(500).json({error: "Error fetching order"})
        }
    });
    


    
    app.listen(port, () => {
        console.log('Server is running on port', port);
    })
})


