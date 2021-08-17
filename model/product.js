// const mongoose = require("mongoose");
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String, //T-Shirts, Hoodies, Jackets, Pants
    },
    comments: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// module.exports = mongoose.model("Product", productSchema);
export default mongoose.model("Product", productSchema);
