import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Product } from "./database/models/product.entity";
import * as dotenv from "dotenv";

// Load environment variables with explicit path
const envPath = path.resolve(process.cwd(), "app/backend/.env");
console.log(`Loading .env file from: ${envPath}`);
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3000;

// Debug environment variables
console.log("Environment Variables:");
console.log(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
console.log(`POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);
console.log(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
console.log(`POSTGRES_USERNAME: ${process.env.POSTGRES_USERNAME}`);
console.log(`Using password: ${process.env.POSTGRES_PASSWORD ? "Yes" : "No"}`);

app.use(
  cors({
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
    ],
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    origin: "*",
  })
);
app.use(express.json());

// Configure TypeORM connection using DataSource
const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Product],
  synchronize: false, // Change to false to prevent schema modifications
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  // Add connection timeout options
  connectTimeoutMS: 10000,
});

dataSource
  .initialize()
  .then(() => {
    console.log("Connected to PostgreSQL successfully");

    // API Endpoints
    app.get("/api/products", async (req, res) => {
      try {
        const productRepository = dataSource.getRepository(Product);
        console.log("Attempting to query products table...");
        
        const products = await productRepository
          .createQueryBuilder("product")
          .select([
            "product.id",
            "product.name", 
            "product.price", 
            "product.description",
            "product.images"
          ])
          .getMany();
          
        console.log(`Successfully retrieved ${products.length} products`);
        
        // Process products to ensure consistent format for frontend
        const formattedProducts = products.map(product => {
          // Convert PostgreSQL array to JavaScript array if needed
          let processedImages = product.images;
          
          // Handle different possible formats from the database
          if (typeof processedImages === 'string' && processedImages.startsWith('{') && processedImages.endsWith('}')) {
            // Parse PostgreSQL array format '{url1,url2}' to JavaScript array
            processedImages = processedImages.substring(1, processedImages.length - 1).split(',');
          }
          
          // Ensure the images array is properly formatted with valid URLs
          if (Array.isArray(processedImages)) {
            // Process each image URL to ensure it's valid
            processedImages = processedImages.map(img => {
              // Remove any quotes or whitespace
              let cleanUrl = img.trim().replace(/^["']|["']$/g, '');
              
              // Check if it's a valid URL or a relative path
              if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
                // Try to convert it to an absolute URL if it seems to be a Nike path
                if (cleanUrl.includes('nike') || cleanUrl.includes('static.nike.com')) {
                  cleanUrl = `https://${cleanUrl.replace(/^\/\//, '')}`;
                }
              }
              
              console.log(`Processed image URL: ${cleanUrl}`);
              return cleanUrl;
            });
          }
          
          return {
            ...product,
            images: processedImages || [] // Ensure it's never undefined
          };
        });
        
        // Log the first product to see the structure
        if (formattedProducts.length > 0) {
          console.log('Sample product:', JSON.stringify(formattedProducts[0], null, 2));
        }
        
        res.json(formattedProducts);
      } catch (error) {
        console.error("Database error when fetching products:", error);
        res.status(500).json({ error: "Error fetching products" });
      }
    });

    app.get("/api/products/:id", async (req, res) => {
      try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const productRepository = dataSource.getRepository(Product);
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

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("TypeORM connection error: ", error);
    console.error("Connection details used:");
    console.error(`Host: ${process.env.POSTGRES_HOST}`);
    console.error(`Port: ${process.env.POSTGRES_PORT}`);
    console.error(`Database: ${process.env.POSTGRES_DB}`);
    console.error(`Username: ${process.env.POSTGRES_USERNAME}`);
    console.error(
      `Password provided: ${process.env.POSTGRES_PASSWORD ? "Yes" : "No"}`
    );
  });
