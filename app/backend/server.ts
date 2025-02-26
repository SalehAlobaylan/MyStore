import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ProductModel } from "./database/models/product.model.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Nike");

app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productIndex = Number(req.params.id);
    if (isNaN(productIndex)) {
      return res.status(400).json({ error: "Invalid product index" });
    }

    const product = await ProductModel.findOne({ index: productIndex });
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
