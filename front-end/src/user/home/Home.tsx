import { useState, useEffect } from "react";
import "../css/Style.css";

import banner1 from "../../assets/banner.jpg";
import banner2 from "../../assets/banner1.jpg";
import banner3 from "../../assets/banner 2.jpg";
import { Products } from "../../interfaces/Products";
import { Link } from "react-router-dom";
import { baseURL } from "../../api";
import ins from "../../api";
import CategoryList from "../page/Category";
const bannerImages = [banner1, banner2, banner3,];

// Component Banner (Phần banner chính)
const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Đổi ảnh mỗi 3 giây
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="banner">
      <img src={bannerImages[currentIndex]} alt={`Banner ${currentIndex + 1}`} />
      <div className="banner-controls">
        <button className="banner-button left" onClick={handlePrev}>
          &#8592;
        </button>
        <button className="banner-button right" onClick={handleNext}>
          &#8594;
        </button>
      </div>
    </div>
  );
};

// Component ProductCard (Khung sản phẩm)
const ProductCard = ({ product }: { product: Products }) => {
  return (
    <Link
      className="text-decoration-none text-white"
      to={`/products/${product._id}`}
    >
      <div className="product-card">
        <div className="product-image">
          <img
            src={`${baseURL}/images/` + product.image}
            alt={product.title}
            className="image"
          />
        </div>
        <h3 className="product-title">{product.title}</h3>
        <p className="price-range">{product.priceRange} VNĐ</p>
        <button className="buy-button">Mua ngay</button>
      </div>
    </Link>
  );
};

const ProductList = ({ products }: { products: Products[] }) => {
  return (
    <section className="product-list">
      <h2>Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};


// Component Deals (Khuyến mãi nổi bật)
const Deals = () => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    ins.get(`${baseURL}/products/without-variants`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm: ", error);
      });
  }, []);

  return (
    <section className="deals">
      <h2>Khuyến mãi Online</h2>
      <ProductList products={products} />
    </section>
  );
};

// Trang chủ chính
const Home = () => {
  return (
    <div>
      <MainBanner />
      <Deals />
      <CategoryList/>
    </div>
  );
};

export default Home;
