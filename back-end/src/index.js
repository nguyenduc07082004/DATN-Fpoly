const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRouter= require("./routes/ProductsRouter");
const categoryRouter=require("./routes/CategoryRouter")


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// Kết nối đến MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Kết nối MongoDB thất bại:", err));

  app.use(express.json());
  app.use('/products',productRouter);
  app.use('/categories',categoryRouter);

// Định nghĩa một route đơn giản
app.get("/", (req, res) => {
  res.send("Hello world!!");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
