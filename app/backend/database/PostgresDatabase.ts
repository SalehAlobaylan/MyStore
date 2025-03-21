// import "reflect-metadata";
// import { createConnection } from "typeorm";
// import express from "express";
// import cors from "cors";
// import { Product } from "./models/product.entity";
// const app = express();
// const port = 3000;

// app.use(
//   cors({
//     origin: "http://localhost:4200", // Adjust this to match your Angular app's URL
//   })
// );
// app.use(express.json());

// // Configure TypeORM connection
// createConnection({
//   type: "postgres",
//   host: process.env.POSTGRES_HOST,
//   port: 5432,
//   username: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   entities: [Product],
//   synchronize: true, // Set to false in production
//   ssl: {
//     rejectUnauthorized: false, // For AWS RDS SSL connection
//   },
// })
//   .then((connection) => {
//     console.log("Connected to PostgreSQL");

//     // API Endpoints
//     app.get("/api/products", async (req, res) => {
//       try {
//         const productRepository = connection.getRepository(Product);
//         const products = await productRepository.find();
//         res.json(products);
//       } catch (error) {
//         res.status(500).json({ error: "Error fetching products" });
//       }
//     });

//     app.get("/api/products/:id", async (req, res) => {
//       try {
//         const productId = Number(req.params.id);
//         if (isNaN(productId)) {
//           return res.status(400).json({ error: "Invalid product ID" });
//         }

//         const productRepository = connection.getRepository(Product);
//         const product = await productRepository.findOneBy({ id: productId });

//         if (product) {
//           res.json(product);
//         } else {
//           res.status(404).json({ error: "Product not found" });
//         }
//       } catch (error) {
//         res.status(500).json({ error: "Error fetching product" });
//       }
//     });

//     app.listen(port, () => {
//       console.log(`Server running at http://localhost:${port}`);
//     });
//   })
//   .catch((error) => console.log("TypeORM connection error: ", error));
