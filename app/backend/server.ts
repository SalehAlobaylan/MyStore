// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import express from "express";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import { Product } from "./database/models/product.entity";
// import { Order } from "./database/models/order.entity";
// import * as dotenv from "dotenv";

// // Load environment variables
// const envPath = path.resolve(process.cwd(), "app/backend/.env");
// dotenv.config({ path: envPath });

// const app = express();
// const port = process.env.PORT || 8081;
// const isCI = process.env.NODE_ENV === "ci";
// const isProd = process.env.NODE_ENV === "production";

// // CORS setup
// app.use(
//   cors({
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "X-Access-Token",
//       "Authorization",
//       "Access-Control-Allow-Origin",
//       "Access-Control-Allow-Headers",
//       "Access-Control-Allow-Methods",
//     ],
//     methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
//     preflightContinue: true,
//     origin: "*",
//   })
// );
// app.use(express.json());

// // Health check endpoint for CI testing
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Serve static files in production
// if (isProd) {
//   // Try looking for files in different possible locations
//   const possiblePaths = [
//     path.join(__dirname, "../../../dist/MyStore"),
//     path.join(__dirname, "../../MyStore"),
//     path.join(__dirname, "../MyStore"),
//     path.join(__dirname, "../../../app/MyStore/dist/my-store"),
//   ];

//   let staticPath = "";
//   for (const p of possiblePaths) {
//     if (fs.existsSync(p)) {
//       staticPath = p;
//       console.log(`Using static files from: ${staticPath}`);
//       break;
//     }
//   }

//   if (staticPath) {
//     app.use(express.static(staticPath));

//     // Serve index.html for any non-API routes
//     app.get("*", (req, res) => {
//       if (!req.path.startsWith("/api")) {
//         res.sendFile(path.join(staticPath, "index.html"));
//       }
//     });
//   } else {
//     console.warn("No static files directory found");
//   }
// }

// // Skip database connection in CI environment
// if (isCI) {
//   console.log("Running in CI environment - skipping database connection");

//   // Mock API response for testing
//   app.get("/api/products", (req, res) => {
//     res.json([
//       {
//         id: 1,
//         name: "Test Product",
//         price: 99.99,
//         images: ["test.jpg"],
//         description: "Test description",
//       },
//     ]);
//   });

//   app.listen(port, () => {
//     console.log(`Server running in CI mode at http://localhost:${port}`);
//   });
// } else {
//   // Configure TypeORM connection
//   const dataSource = new DataSource({
//     type: "postgres",
//     host: process.env.POSTGRES_HOST,
//     port: parseInt(process.env.POSTGRES_PORT || "5432"),
//     username: process.env.POSTGRES_USERNAME,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DB,
//     entities: [Product, Order],
//     synchronize: false,
//     ssl: { rejectUnauthorized: false },
//     extra: {
//       ssl: { require: true, rejectUnauthorized: false },
//     },
//     connectTimeoutMS: 10000,
//   });

//   dataSource
//     .initialize()
//     .then(() => {
//       console.log("Connected to PostgreSQL successfully");

//       // Products API
//       app.get("/api/products", async (req, res) => {
//         try {
//           const productRepository = dataSource.getRepository(Product);
//           const products = await productRepository
//             .createQueryBuilder("product")
//             .select([
//               "product.id",
//               "product.name",
//               "product.price",
//               "product.description",
//               "product.images",
//             ])
//             .getMany();

//           // Process products to ensure consistent format
//           const formattedProducts = products.map((product) => {
//             let processedImages: any = product.images || [];

//             // Handle different possible formats
//             if (typeof processedImages === "string") {
//               processedImages = processedImages
//                 .replace(/[{}"]/g, "")
//                 .split(",");
//             }

//             // Process and combine image URLs
//             const combinedImages: string[] = [];
//             if (Array.isArray(processedImages)) {
//               for (let i = 0; i < processedImages.length; i++) {
//                 let img = processedImages[i];
//                 if (typeof img === "string") {
//                   if (
//                     img.trim().endsWith("/f_auto") &&
//                     i + 1 < processedImages.length
//                   ) {
//                     const nextPart = processedImages[i + 1];
//                     if (
//                       typeof nextPart === "string" &&
//                       nextPart.trim().startsWith("q_auto")
//                     ) {
//                       combinedImages.push(`${img}/${nextPart}`);
//                       i++;
//                       continue;
//                     }
//                   }
//                   combinedImages.push(img);
//                 }
//               }
//             }

//             // Ensure valid image URLs
//             const finalImages = combinedImages
//               .map((img) => {
//                 if (!img || typeof img !== "string") return "";

//                 let cleanUrl = img.trim();

//                 // Fix URL format
//                 if (cleanUrl.startsWith("//")) {
//                   return `https:${cleanUrl}`;
//                 } else if (cleanUrl.startsWith("static.nike.com")) {
//                   return `https://${cleanUrl}`;
//                 } else if (!cleanUrl.startsWith("http")) {
//                   if (
//                     cleanUrl.startsWith("q_auto") ||
//                     cleanUrl.includes("/dri-fit") ||
//                     cleanUrl.includes(".png") ||
//                     cleanUrl.includes(".jpg")
//                   ) {
//                     return `https://static.nike.com/a/images/${cleanUrl}`;
//                   }
//                   return "";
//                 }
//                 return cleanUrl;
//               })
//               .filter((url) => url !== "");

//             // Add fallback if no images
//             if (finalImages.length === 0) {
//               finalImages.push(
//                 "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-mens-shoes-jBrhbr.png"
//               );
//             }

//             return { ...product, images: finalImages };
//           });

//           res.json(formattedProducts);
//         } catch (error) {
//           console.error("Database error:", error);
//           res.status(500).json({ error: "Error fetching products" });
//         }
//       });

//       // Single product API
//       app.get("/api/products/:id", async (req, res) => {
//         try {
//           const productId = Number(req.params.id);
//           if (isNaN(productId)) {
//             return res.status(400).json({ error: "Invalid product ID" });
//           }

//           const productRepository = dataSource.getRepository(Product);
//           const product = await productRepository.findOneBy({ id: productId });

//           if (product) {
//             res.json(product);
//           } else {
//             res.status(404).json({ error: "Product not found" });
//           }
//         } catch (error) {
//           res.status(500).json({ error: "Error fetching product" });
//         }
//       });

//       // Add these new endpoints after the existing product endpoints
//       app.post("/api/orders", async (req, res) => {
//         try {
//           const { fullName, address, creditCard, total, items } = req.body;
          
//           if (!fullName || !address || !creditCard || !total || !items) {
//             return res.status(400).json({ 
//               error: "Missing required fields (fullName, address, creditCard, total, items)" 
//             });
//           }

//           const orderRepository = dataSource.getRepository(Order);
//           const productRepository = dataSource.getRepository(Product);
          
//           // Get the last 4 digits of the credit card (for security)
//           const creditCardLast4 = creditCard.slice(-4);
          
//           // Find all products in the order
//           const productIds = items.map(item => item.product.id);
//           const productEntities = await productRepository.findByIds(productIds);
          
//           // Create and save the new order
//           const newOrder = orderRepository.create({
//             fullName,
//             address,
//             creditCardLast4,
//             total,
//             products: productEntities
//           });
          
//           const savedOrder = await orderRepository.save(newOrder);
//           res.status(201).json({ 
//             message: "Order created successfully", 
//             orderId: savedOrder.id 
//           });
//         } catch (error) {
//           console.error("Error creating order:", error);
//           res.status(500).json({ error: "Error creating order" });
//         }
//       });

//       app.get("/api/orders", async (req, res) => {
//         try {
//           const orderRepository = dataSource.getRepository(Order);
//           const orders = await orderRepository.find({ 
//             relations: ["products"] 
//           });
//           res.json(orders);
//         } catch (error) {
//           res.status(500).json({ error: "Error fetching orders" });
//         }
//       });

//       app.get("/api/orders/:id", async (req, res) => {
//         try {
//           const orderId = Number(req.params.id);
//           if (isNaN(orderId)) {
//             return res.status(400).json({ error: "Invalid order ID" });
//           }

//           const orderRepository = dataSource.getRepository(Order);
//           const order = await orderRepository.findOne({
//             where: { id: orderId },
//             relations: ["products"]
//           });

//           if (order) {
//             res.json(order);
//           } else {
//             res.status(404).json({ error: "Order not found" });
//           }
//         } catch (error) {
//           res.status(500).json({ error: "Error fetching order" });
//         }
//       });

//       app.listen(port, () => {
//         console.log(`Server running at http://localhost:${port}`);
//       });
//     })
//     .catch((error) => {
//       console.error("Database connection error:", error);
//     });
// }
