import express, { Router } from "express";
import Product from "../models/productSchema.js";
import { body } from "express-validator";

const productRouter = express.Router();
const productValidation = [
  body("name").notEmpty().withMessage("Name is required")
]
// creating product
productRouter.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body); //  all data required for creating product will receive krom req.body
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error); //error ko errorHandler handle krega
  }
});

// get all product
productRouter.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
});
// update product by id
productRouter.put("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product Not Found" });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
});
// delete product by id
productRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
});
export { productRouter };
