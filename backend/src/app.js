import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from './routes/userRoutes.js'
//import contactRoutes from './routes/contactRoutes.js'

const app = express();
const uri = process.env.ATLASDB_URL;
const server = createServer(app);
const io = connectToSocket(server)

app.set("port", process.env.PORT || 5500);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));

app.use("/api/v1/users",userRoutes);
//app.use("/api/v1",contactRoutes)

app.use((req, res, next) => {
  res.status(404).send({ message: "Page not found" });
});


app.get("/home", (req, res) => {
  res.send("done it work");
});

const start = async () => {
  mongoose.connect(uri, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

  
  server.listen(app.get("port"), () => {
    console.log("Listing at port 5500");
  });
};

start();
