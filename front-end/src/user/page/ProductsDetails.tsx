import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { Products } from "../../interfaces/Products";
import Logo from "../../assets/logoshop.jpg";
import { CartContext } from "../../api/contexts/CartContext";
import { baseURL } from "../../api";
const storage1 = [
  { _id: "1", options: "128GB" },
  { _id: "2", options: "256GB" },
  { _id: "3", options: "512GB" },
  { _id: "4", options: "1TB" },
];
const color1 = [
  { _id: "1", options: "Đen" },
  { _id: "2", options: "Trắng" },
  { _id: "3", options: "Hồng" },
  { _id: "4", options: "Xanh" },
];
// Component Header
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>
      <nav>
        <ul>
          <li>Điện thoại</li>
          <li>Laptop</li>
          <li>Phụ kiện</li>
          <li>Smartwatch</li>
          <li>Đồng hồ</li>
          <li>Máy cũ</li>
          <li>Dịch vụ</li>
        </ul>
      </nav>
      <div className="user-options">
        <span>Đăng nhập</span>
        <span>Giỏ hàng</span>
      </div>
    </header>
  );
};

// Main ProductDetails Component
const ProductDetails = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [suggestedProducts, setSuggestedProducts] = useState<Products[]>([]);
  const token = localStorage.getItem("accessToken");
  const [product, setProduct] = useState<Products>({} as Products);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu sắc!");
      return;
    }
    addToCart(product, quantity, selectedColor); // Truyền selectedColor vào
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  useEffect(() => {
    // Fetch the current product
    axios
      .get(`http://localhost:8000/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setMainImage(response.data.imageURL);
        setLoading(false);

        // Scroll to the top of the page when product details change
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Error fetching product details: ", error);
        setError("Lỗi khi tải dữ liệu sản phẩm!");
        setLoading(false);
      });

    // Fetch suggested products
    axios
      .get(`http://localhost:8000/products`)
      .then((response) => {
        setSuggestedProducts(
          response.data.filter((prod: Products) => prod._id !== productId)
        );
      })
      .catch((error) => {
        console.error("Error fetching suggested products: ", error);
      });
  }, [productId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (!product) {
    return (
      <Typography variant="h6" color="error">
        Không tìm thấy sản phẩm!
      </Typography>
    );
  }

  const additionalImages = [
    product.image,
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
  ];

  return (
    <>
      {/* Include Header */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{
              color: "#2e7d32",
              borderColor: "#2e7d32",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "#e8f5e9",
                borderColor: "#2e7d32",
              },
            }}
          >
            Quay lại trang chính
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {additionalImages.map((img, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      component="img"
                      src={`${baseURL}/images/` + product.image}
                      alt={`additional ${index}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        boxShadow: 3,
                        cursor: "pointer",
                        border:
                          mainImage === img
                            ? "2px solid #2e7d32"
                            : "1px solid #ccc",
                        transition: "border 0.3s ease",
                        "&:hover": {
                          border: "2px solid #2e7d32",
                        },
                      }}
                      onClick={() => setMainImage(img)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#2e7d32",
                  background:
                    "-webkit-linear-gradient(45deg, #32cd32, #6b8e23)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                {product.title}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: "1.5rem",
                  color: "#d32f2f",
                  background:
                    "-webkit-linear-gradient(45deg, #ff8a80, #ff5252)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                {product.price.toLocaleString("vi-VN")} VNĐ
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  color: "#455a64",
                  borderLeft: "4px solid #2e7d32",
                  paddingLeft: 2,
                  mb: 3,
                }}
              >
                {product.description}
              </Typography>

              {/* Color Selection */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Chọn màu sắc:
                </Typography>
                <br />
                <Grid container spacing={2}>
                  <select
                    className="form-control"
                    style={{ width: "200px", height: "50px" }}
                    onChange={(e) => handleColorChange(e.target.value)}
                  >
                    {color1?.map((color) => (
                      <option value={color.options}>{color.options}</option>
                    ))}
                  </select>
                </Grid>
              </Box>

              <input
                placeholder="Số lượng"
                type="number"
                defaultValue={quantity}
                min="1"
                onChange={handleQuantityChange}
                style={{ marginTop: 10, padding: 5 }}
              />

              {!token ? (
                "Đăng nhập để mua hàng"
              ) : (
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  sx={{
                    backgroundColor: "#ff5722",
                    color: "#fff",
                    mt: 3,
                    width: "100%",
                    py: 2,
                    "&:hover": {
                      backgroundColor: "#ff3d00",
                    },
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Suggested Products Section */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
              Sản phẩm gợi ý
            </Typography>
            <Grid container spacing={4}>
              {suggestedProducts.map((suggestedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={suggestedProduct._id}>
                  <Box
                    component={Link}
                    to={`/products/${suggestedProduct._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={`${baseURL}/images/` + product.image}
                      alt={suggestedProduct.title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {suggestedProduct.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {suggestedProduct.price.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProductDetails;
