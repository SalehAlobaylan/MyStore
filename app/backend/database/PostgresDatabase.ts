import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
import { Product } from "./models/product.entity";
import { Order } from "./models/order.entity";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200", // Adjust this to match your Angular app's URL
  })
);
app.use(express.json());

// Configure TypeORM connection
createConnection({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Product, Order],
  synchronize: true, // Set to false in production
  ssl: {
    rejectUnauthorized: false, // For AWS RDS SSL connection
  },
})
  .then((connection) => {
    console.log("Connected to PostgreSQL");

    // API Endpoints
    app.get("/api/products", async (req, res) => {
      try {
        const productRepository = connection.getRepository(Product);
        const products = await productRepository.find();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
      }
    });

    app.get("/api/products/:id", async (req, res) => {
      try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const productRepository = connection.getRepository(Product);
        const product = await productRepository.findOneBy({ id: productId });

        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching product" });
      }
    });

    // New endpoint to create an order
    app.post("/api/orders", async (req, res) => {
      try {
        const { fullName, address, creditCard, total, products } = req.body;
        
        if (!fullName || !address || !creditCard || !total || !products) {
          return res.status(400).json({ 
            error: "Missing required fields (fullName, address, creditCard, total, products)" 
          });
        }

        const orderRepository = connection.getRepository(Order);
        const productRepository = connection.getRepository(Product);
        
        // Get the last 4 digits of the credit card
        const creditCardLast4 = creditCard.slice(-4);
        
        // Find all products in the order
        const productEntities = await productRepository.findByIds(
          products.map(p => p.id)
        );
        
        // Create and save the new order
        const newOrder = orderRepository.create({
          fullName,
          address,
          creditCardLast4,
          total,
          products: productEntities
        });
        
        const savedOrder = await orderRepository.save(newOrder);
        res.status(201).json({ 
          message: "Order created successfully", 
          orderId: savedOrder.id 
        });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" });
      }
    });

    // New endpoint to get all orders
    app.get("/api/orders", async (req, res) => {
      try {
        const orderRepository = connection.getRepository(Order);
        const orders = await orderRepository.find({ 
          relations: ["products"] 
        });
        res.json(orders);
      } catch (error) {
        res.status(500).json({ error: "Error fetching orders" });
      }
    });

    // New endpoint to get a single order
    app.get("/api/orders/:id", async (req, res) => {
      try {
        const orderId = Number(req.params.id);
        if (isNaN(orderId)) {
          return res.status(400).json({ error: "Invalid order ID" });
        }

        const orderRepository = connection.getRepository(Order);
        const order = await orderRepository.findOne({
          where: { id: orderId },
          relations: ["products"]
        });

        if (order) {
          res.json(order);
        } else {
          res.status(404).json({ error: "Order not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
