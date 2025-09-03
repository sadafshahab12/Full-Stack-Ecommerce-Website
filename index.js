import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { productRouter } from "./routes/productRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDb();
// middlewares

app.use("/api/products", productRouter);
app.use(errorHandler);
app.listen(process.env.PORT, () =>
  console.log("Server running on port http://localhost:5000")
);
