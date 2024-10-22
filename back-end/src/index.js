const express = require("express"); 
const mongoose = require("mongoose");
const authRouter=require("./services/auth");


require("dotenv/config");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// Kết nối đến MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Kết nối MongoDB thất bại:", err));

  authRouter(app);
// Định nghĩa một route đơn giản
app.get("/", (req, res) => {
  res.send("Hello world!!");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
