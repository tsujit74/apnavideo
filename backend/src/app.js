import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from './routes/userRoutes.js'

const app = express();
const server = createServer(app);
const io = connectToSocket(server)

app.set("port", process.env.PORT || 5500);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));

app.use("/api/v1/users",userRoutes);

app.get("/home", (req, res) => {
  res.send("done it work");
});

const start = async () => {
  const connectiondb = await mongoose.connect(
    "mongodb+srv://tsujit995552:rcBNF7H1ZXDePz4t@apnavideo.v14bp.mongodb.net/?retryWrites=true&w=majority&appName=apnavideo"
  );
  console.log(`Mongo Connected DB host: ${connectiondb.connection.host}`)
  server.listen(app.get("port"), () => {
    console.log("Listing at port 5500");
  });
};

start();
