// getting-started.js
// const mongoose = require('mongoose');
import mongoose from "mongoose";
import { Product } from "../../MyStore/src/app/modules/product.js";
import { ProductModel, IProduct } from "./models/product.model.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/NikeProducts");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');`
  // if your database has auth enabled
}

export class MongoDatabase {
  private static instance: MongoDatabase;
  private readonly uri = "mongodb://127.0.0.1:27017/NikeProducts";

  private constructor() {
    this.connect();
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  private async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("Connected to MongoDB using Mongoose");
    } catch (error) {
      console.error("Mongoose connection error:", error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const products = await ProductModel.find().exec();
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
        description: p.description,
        quantity: p.quantity,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const product = await ProductModel.findOne({ id: id }).exec();
      return product
        ? {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            description: product.description,
            quantity: product.quantity,
          }
        : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async addProduct(product: Product): Promise<void> {
    try {
      await ProductModel.create(product);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async updateProduct(product: Product): Promise<void> {
    try {
      await ProductModel.findOneAndUpdate({ id: product.id }, product).exec();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await ProductModel.findOneAndDelete({ id: id }).exec();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      throw error;
    }
  }
}
