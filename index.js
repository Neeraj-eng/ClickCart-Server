import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import dotenv from "dotenv";

import { connect } from "./config/mongoconnect.js";
import { Cloudinaryconnect } from "./config/Cloudinaryconnect.js";
import router from "./routes/Router.js";

dotenv.config();

const app = express();

let isConnected = false;

const init = async () => {
  try {
    console.log("Connecting to DB...");

    await connect();
    await Cloudinaryconnect();

    isConnected = true;
    console.log("Database and Cloudinary connected");
  } catch (error) {
    console.error("Init error:", error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await init();
    }

    next();
  } catch (error) {
    console.error("Server initialization failed:", error);

    res.status(500).json({
      success: false,
      message: "Server initialization failed",
    });
  }
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true, limit: "4mb" }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: false,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClickCart Server is running 🚀",
  });
});

app.use("/api", router);

export default app;
