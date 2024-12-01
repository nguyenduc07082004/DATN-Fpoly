import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/routes/auth.js";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { languageMiddleware } from "./src/middleware/languageMiddleware.js";
import http from "http";
import { Server as socketIo } from "socket.io"; // Sử dụng cú pháp import đúng cho ESM

dotenv.config();

const app = express();
const server = http.createServer(app); // Tạo server HTTP từ express
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"],
    credentials: true, 
  },
});export {io};
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Thay đổi nếu cần thiết
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Kết nối MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((error) => console.error("Lỗi kết nối MongoDB:", error));

// Sử dụng các router
app.use(languageMiddleware);
app.use("/", authRouter);

app.use("/images", express.static("uploads"));


const previousStatuses = {}; 

io.on("connection", (socket) => {
  socket.on("orderStatusUpdated", async (data) => {
    const { orderId, status } = data;

    const previousStatus = previousStatuses[orderId];

    if (previousStatus !== status) {
      previousStatuses[orderId] = status;

      io.emit("orderStatusUpdated", {
        message: `Trạng thái đơn hàng ${orderId} đã thay đổi thành ${status}`,
        orderId: orderId,
        status: status,
        userId: data.userId,
      });
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
