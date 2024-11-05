import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// CORS
import cors from "cors";
import authRouter from "./src/services/auth.js";
app.use(cors());

// Kết nối đến MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Kết nối MongoDB thành công!");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", authRouter);
app.use("/images", express.static("uploads"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
