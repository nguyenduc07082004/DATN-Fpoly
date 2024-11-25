import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
  CardContent,
  CardActionArea,
  Card,
  CardMedia,
} from "@mui/material";
import { Products } from "../../interfaces/Products";
import Logo from "../../assets/logoshop.jpg";
import { CartContext } from "../../api/contexts/CartContext";
import { baseURL } from "../../api";
import ins from "../../api";
import { Variant } from "../../interfaces/Products";

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

// Color options (cứng)
const colorOptions = [
  { _id: "1", color: "#000000", options: "Đen" },   
  { _id: "2", color: "#ffffff", options: "Trắng" },  
  { _id: "3", color: "#ff69b4", options: "Hồng" }, 
  { _id: "4", color: "#0000ff", options: "Xanh" },   
];

// Main ProductDetails Component
const ProductDetails = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [availableVariants, setAvailableVariants] = useState<any[]>([]);  
  const [availableStorages, setAvailableStorages] = useState<{_id : string; storage: string; quantity: number; price: number }[]>([]);  
  const [selectedPrice, setSelectedPrice] = useState<number>(0); 
  const [suggestedProducts, setSuggestedProducts] = useState<Products[]>([]);
  const token = localStorage.getItem("accessToken");
  const [product, setProduct] = useState<Products>({} as Products);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState<string>("");
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    const variant = availableStorages.find(v => v._id === variantId);
    
    if (variant) {
      addToCart({
        productId: product._id,
        variantId: variant._id,
        storage: variant.storage,
        price: variant.price,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedStorage: variant.storage
      });
    } else {
      console.error("Variant không hợp lệ");
    }
  };
  

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  
    // Lọc các biến thể theo màu sắc
    const filteredVariants = product.variants.filter(
      (variant: Variant) => variant.color === color
    );
  
    if (filteredVariants.length === 0) {
      setSelectedStorage("");
      setAvailableStorages([]);
    } else {
      setSelectedStorage("");
      const storageWithQuantityAndPrice = filteredVariants.map((variant: Variant) => ({
        _id: variant._id,
        storage: variant.storage,
        quantity: variant.quantity,
        price: variant.price,  
      }));
  
      setAvailableStorages(storageWithQuantityAndPrice);
    }
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
  
    const selectedVariant = product.variants.find(
      (variant: Variant) => variant.storage === storage
    );
  
    if (selectedVariant) {
      setSelectedPrice(selectedVariant.price);
      setVariantId(selectedVariant._id);
    }
  };

  const getProductById = async () => {
    await ins
      .get(`${baseURL}/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setMainImage(response.data.image);
        setLoading(false);
        window.scrollTo(0, 0);
        setAvailableVariants(response.data.variants);
      })
      .catch((error) => {
        console.error("Error fetching product details: ", error);
        setError("Lỗi khi tải dữ liệu sản phẩm!");
        setLoading(false);
      });
  };

  const getProductWithoutsVariants = async () => {
    await ins.get(`${baseURL}/products/without-variants`).then((response) => {
      setSuggestedProducts(
        response.data.filter((prod: Products) => prod._id !== productId)
      );
      setSelectedColor("");
      setAvailableStorages([]);
    })
    .catch((error) => {
      console.error("Error fetching suggested products: ", error);
    });
  };

  const getData = async () => {
    getProductById();
    getProductWithoutsVariants();
  };

  useEffect(() => {
    getData();
  }, [productId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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

  return (
    <>
    <Header />
    <Container maxWidth="lg" sx={{ mt: 4 }}>
  <Grid container spacing={4}>
    <Grid item xs={12} md={5}>
      <Box
        component="img"
        src={mainImage ? `${baseURL}/images/${mainImage}` : `${baseURL}/images/${product.image}`}
        alt="Main product image"
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          borderRadius: 2,
          boxShadow: 3,
        }}
      />
    </Grid>

    <Grid item xs={12} md={7}>
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="body1">{product.description}</Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Chọn màu sắc:
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          {colorOptions.map((color) => (
            <Button
              key={color._id}
              variant="contained"
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: color.color,
                padding: 0,
                boxShadow: selectedColor === color.options ? "0px 0px 10px 2px rgba(0, 0, 0, 0.2)" : "none",
                border: selectedColor === color.options ? "3px solid #fff" : "none",
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: color.color,
                  boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
                },
                '&:active': {
                  transform: "scale(0.95)",
                },
                position: "relative",
              }}
              onClick={() => handleColorChange(color.options)}
            >
              {selectedColor === color.options && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FFD700",
                  }}
                >
                  ✓
                </Box>
              )}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Chọn dung lượng:
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          {availableStorages.length > 0 ? (
            availableStorages
              .sort((a, b) => {
                const sizeA = parseInt(a.storage.replace(/\D/g, ''));
                const sizeB = parseInt(b.storage.replace(/\D/g, ''));
                return sizeA - sizeB;
              })
              .map(({ storage, quantity, price }) => (
                <Button
                  key={storage}
                  variant="contained"
                  onClick={() => handleStorageChange(storage)}
                  sx={{
                    padding: "8px 20px",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 1,
                    backgroundColor: selectedStorage === storage ? "black" : "white",
                    color: selectedStorage === storage ? "white" : "black",
                    border: selectedStorage === storage ? "2px solid white" : "1px solid #ccc",
                    '&:hover': {
                      backgroundColor: selectedStorage === storage ? "black" : "#f0f0f0",
                      color: selectedStorage === storage ? "white" : "black",
                    }
                  }}
                >
                  {storage} ({quantity})
                </Button>
              ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Không có dung lượng cho màu sắc này.
            </Typography>
          )}
        </Box>
      </Box>

      {selectedStorage && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Giá tiền:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" , color: "red"}}>
            {selectedPrice.toLocaleString("vi-VN")} VNĐ
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleAddToCart}
        sx={{ mt: 3 }}
        disabled={!selectedStorage}
      >
        Thêm vào giỏ hàng
      </Button>
    </Grid>
  </Grid>

  <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>
    Sản phẩm gợi ý
  </Typography>
  <Grid container spacing={3}>
    {suggestedProducts.map((suggestedProduct) => (
      <Grid item xs={12} sm={6} md={3} key={suggestedProduct._id}>
        <Card>
          <CardActionArea component={Link} to={`/products/${suggestedProduct._id}`}>
            <CardMedia
              component="img"
              height="200"
              image={`${baseURL}/images/${suggestedProduct.image}`}
              alt={suggestedProduct.title}
            />
            <CardContent>
              <Typography variant="h6" noWrap>
                {suggestedProduct.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {suggestedProduct.price.toLocaleString("vi-VN")} VNĐ
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

    </>
  );
};

export default ProductDetails;