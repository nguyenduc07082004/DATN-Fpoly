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
  TextField,
  Rating,
} from "@mui/material";
import { Products } from "../../interfaces/Products";
import { CartContext } from "../../api/contexts/CartContext";
import { baseURL } from "../../api";
import ins from "../../api";
import { Variant } from "../../interfaces/Products";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'
import Swal from "sweetalert2";
const colorMapping = {
  Đen: "#000000",    
  Trắng: "#FFFFFF",  
  Xanh: "#0000FF",   
  Hồng: "#FFC0CB",  
  
};

const ProductDetails = () => {
  const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
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
  const [comments, setComments] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [comment , setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleAddToCart = async () => {
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng đăng nhập',
        text: 'Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.',
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Đăng ký',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login'; 
        } else {
          window.location.href = '/register'; 
        }
      });
    } else {
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
        toastr.success("Sản phẩm đã được thêm vào giỏ hàng!", "Thành công");
      } else {
        toastr.error("Variant không hợp lệ", "Lỗi");
      }
    }
  };
  
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  
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
      (variant: Variant) => variant.storage === storage && variant.color === selectedColor
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

  const getComments = async () => {
    try {
      const response = await ins.get(`${baseURL}/comments/replies/${productId}`);
      setComments(response.data.comments);
      setAvgRating(response.data.averageRating);
    } catch (error) {
      console.log(error)
    }
  }

  const handleCommentChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value); 
  };

  const handleRatingChange = (newValue : number) => {
    setRating(newValue); 
  };
  const handleAddComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 

    if (!comment || rating === 0) {
      alert("Vui lòng điền đầy đủ bình luận và chọn rating.");
      return;
    }

    try {
      const response = await ins.post(`${baseURL}/comments`, {
        userId,
        productId,
        comment,
        rating,
      });

      if (response.status === 201) {
        alert('Bình luận của bạn đã được gửi!');
        setComment(''); 
        setRating(0);    
        getComments();
      } 
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const getData = async () => {
    getProductById();
    getProductWithoutsVariants();
    getComments();
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
    <div className="container-xl bg-white rounded shadow-sm p-4">
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
    

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
  {Array.from(
    new Set(availableVariants.map((variant) => variant.color)) // Lấy tên màu từ DB
  ).map((colorName) => {
    const color = colorMapping[colorName] || "#000000"; // Lấy mã màu từ bảng ánh xạ

    // Lọc ra các variant có màu cụ thể
    const variantsWithColor = availableVariants.filter(
      (variant) => variant.color === colorName
    );

    return (
      <Button
        key={colorName} // Sử dụng colorName làm key
        variant="contained"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: color, // Sử dụng mã màu đã ánh xạ
          padding: 0,
          boxShadow:
            selectedColor === color
              ? "0px 0px 10px 2px rgba(0, 0, 0, 0.2)"
              : "none",
          border: selectedColor === color ? "3px solid #fff" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: color, // Màu sắc sẽ áp dụng khi hover
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          position: "relative",
        }}
        onClick={() => handleColorChange(colorName)} // Gửi tên màu thay vì mã màu
      >
        {selectedColor === color && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 20,
              fontWeight: "bold",
              color: "#FFD700", // Màu dấu check
            }}
          >
            ✓
          </Box>
        )}
      </Button>
    );
  })}
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
                  disabled={quantity === 0}
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
  <Typography variant="body1">{product.description}</Typography>
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
<Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ borderBottom: '1px solid #ccc', paddingBottom: 2 }}>
          <Typography variant="h5" gutterBottom>
            Đánh giá : {product.title}
          </Typography>
          <Typography variant="body1">
            Đánh giá: <Rating value = {avgRating} readOnly /> {`${avgRating} / 5`}
          </Typography>
        </Box>
      </Grid>

      {/* Bình luận */}
      <Grid item xs={12}>
        <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Bình luận:
          </Typography>
          {comments.length > 0 && comments.map((comment) => (
            <Box key={comment.id} sx={{ marginBottom: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {comment.userId.email}
              </Typography>
              <Rating value={comment.rating} readOnly size="small" sx={{ marginBottom: 1 }} />
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                {comment.comment}
              </Typography>

              {/* Phần trả lời */}
              {comment.replies.map((reply, idx) => (
                <Box key={idx} sx={{ marginLeft: 2, marginTop: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {reply.userId.first_name} {reply.userId.last_name}: 
                  </Typography>
                  <Typography variant="body2">
                    {reply.reply}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Grid>

      {/* Thêm bình luận */}
      <Grid item xs={12}>
      <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Thêm bình luận của bạn:
        </Typography>
        <Rating
          value={rating}
          onChange={(event, newValue: number) => handleRatingChange(newValue)}
          sx={{ marginBottom: 2 }}
        />
        {/* TextField để nhập bình luận */}
        <TextField
          label="Bình luận"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={handleCommentChange}
          sx={{ marginBottom: 2 }}
        />
        {/* Nút gửi bình luận */}
        <Button
          onClick={handleAddComment}
          variant="contained"
        >
          Gửi bình luận
        </Button>
      </Box>
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

    </div>
  );
};

export default ProductDetails;