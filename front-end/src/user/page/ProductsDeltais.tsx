import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { Products } from "../../interfaces/Products";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setMainImage(response.data.imageURL); // Set the main image as the default product image
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details: ", error);
        setError("Lỗi khi tải dữ liệu sản phẩm!");
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography variant="h6" color="error">Không tìm thấy sản phẩm!</Typography>;
  }

  const additionalImages = [
    product.imageURL, // Main image
    "/path/to/other-image1.jpg",
    "/path/to/other-image2.jpg",
   
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Back to Home Button in the top-left corner */}
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

      {/* Add some space below the button */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={4}>
          {/* Product Image - Takes 50% width */}
          <Grid item xs={12} md={6}>
            {/* Main Image */}
            <Box
              component="img"
              src={mainImage}
              alt={product.title}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
                mb: 2,
              }}
            />

            {/* Additional Image Gallery */}
            <Grid container spacing={2}>
              {additionalImages.map((img, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    component="img"
                    src={img}
                    alt={`additional ${index}`}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                      boxShadow: 3,
                      cursor: "pointer",
                      border: mainImage === img ? "2px solid #2e7d32" : "1px solid #ccc",
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

          {/* Product Information */}
          <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="flex-start">
            {/* Product Title */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#2e7d32",
                background: "-webkit-linear-gradient(45deg, #32cd32, #6b8e23)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              {product.title}
            </Typography>

            {/* Product Price */}
            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: "1.5rem",
                color: "#d32f2f",
                background: "-webkit-linear-gradient(45deg, #ff8a80, #ff5252)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              {product.price.toLocaleString("vi-VN")} VNĐ
            </Typography>

            {/* Product Description */}
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

            {/* Add to Cart Button */}
            <Button
              variant="contained"
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
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
