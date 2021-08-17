// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const productRoutes = require("./routers/productRoutes");
// const userRoutes = require("./routers/userRoutes");
// const cartRoutes = require("./routers/cartRoutes");
// const bodyParser = require("body-parser");
// const errorHandler = require("./helpers/error-handler");
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routers/productRoutes";
import commentRoutes from "./routers/commentRoutes";
import userRoutes from "./routers/userRoutes";
import cartRoutes from "./routers/cartRoutes";
import bodyParser from "body-parser";
import errorHandler from "./helpers/error-handler";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// require("dotenv").config();

//set up express
("use strict;");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
console.log("starting server...");
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

//set up mongoose
console.log("connnecting Mongo DB...");
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Mongo DB connected...");
  }
);
