const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./services/auth");
const Category = require("./models/CategoryModels"); // Import model Category
const Product = require("./models/ProductModels"); // Import model Product
require("dotenv/config");

const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// CORS
const cors = require("cors");
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
    seedDatabase(); // Gọi hàm thêm dữ liệu sau khi kết nối thành công
  })
  .catch((err) => console.error("Kết nối MongoDB thất bại:", err));

authRouter(app);

app.get("/", (req, res) => {
  res.send("Hello world!!");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});

// Dữ liệu giả cho categories và products
const fakeCategories = [
  { name: "Điện thoại", note: "Các sản phẩm điện thoại" },
  { name: "Phụ kiện", note: "Phụ kiện cho điện thoại" },
];

const fakeProducts = [
  {
    title: "Điện thoại A",
    price: 200,
    imageURL: "https://example.com/imageA.jpg",
    quantity: 10,
    description: "Điện thoại A với màn hình lớn và camera chất lượng.",
  },
  {
    title: "Điện thoại B",
    price: 300,
    imageURL: "https://example.com/imageB.jpg",
    quantity: 5,
    description: "Điện thoại B với pin lâu và hiệu suất mạnh mẽ.",
  },
  {
    title: "Phụ kiện A",
    price: 15,
    imageURL: "https://example.com/imageC.jpg",
    quantity: 20,
    description: "Phụ kiện A cho điện thoại A.",
  },
];

// Hàm thêm dữ liệu
const seedDatabase = async () => {
  try {
    // Xóa dữ liệu cũ nếu cần
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Thêm categories vào database
    const categories = await Category.insertMany(fakeCategories);

    // Gán categories cho products
    for (let product of fakeProducts) {
      // Lấy ngẫu nhiên một category từ danh sách đã tạo
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      product.categories = randomCategory._id; // Gán ID của category vào sản phẩm
    }

    // Thêm sản phẩm vào database
    await Product.insertMany(fakeProducts);
    console.log("Dữ liệu giả đã được thêm vào database!");
  } catch (error) {
    console.error("Có lỗi xảy ra khi thêm dữ liệu:", error);
  }
};
