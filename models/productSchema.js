import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [5, "Name must be at least 5 characters long"],
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [30, "Description must be at least 30 characters"],
    },

    category: {
      type: String,
      enum: ["book", "template", "t-shirt", "digital", "other"],
      required: [true, "Category is required"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
