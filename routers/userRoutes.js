// const express = require("express");
// const User = require("./../model/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const authenticateToken = require("./../helpers/verifyToken");
// const ObjectId = require("mongodb").ObjectID;
import express from "express";
import User from "./../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./../helpers/verifyToken";
// import ObjectId from ("mongodb").ObjectID;
// const { ObjectId } = import("mongodb");
import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

// require("dotenv").config();

const router = express.Router();

//login
router.post("/login", async (req, res, next) => {
  console.log(req.body);
  authenticate(req.body)
    .then((user) =>
      user
        ? res.send(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
});

async function authenticate({ email, password }) {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { sub: user._id, role: user.role, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );
    const { _id, name, email, role } = user;
    return {
      _id,
      name,
      email,
      token,
      role,
    };
  } else return null;
}

//register
router.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
});

//reset info
router.post("/reset", authenticateToken, async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // find the element
    let result = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.user.sub) },
      { name, email, password: hashedPassword }
    );
    if (!result) {
      return res.status(401).send("Wrong id");
    }
    res.send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// module.exports = router;
export default router;
