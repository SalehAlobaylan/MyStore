// import mongoose, { Schema, Document } from "mongoose";
// // import { Product } from "../../../MyStore/src/app/modules/product.js";

// export interface IProduct extends Document {
//   id: number;
//   index: number;
//   name: string;
//   price: number;
//   images: string;
//   description: string;
//   quantity?: number;
// }

// const ProductSchema: Schema = new Schema({
//   id: { type: Number, required: true },
//   index: { type: Number },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   images: { type: String, required: true },
//   description: { type: String, required: true },
//   quantity: { type: Number },
// });

// export const ProductModel = mongoose.model<IProduct>(
//   "Nike",   // here the database i named it "Nike" but still it works if i put "Product"
//   ProductSchema,
//   "Nike" // collection called Nike
// );
