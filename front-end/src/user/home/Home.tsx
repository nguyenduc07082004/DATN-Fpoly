import { useState, useEffect } from "react";
import "../css/Style.css";

import banner1 from "../../assets/home-oppo-find-x8-gia-moi-20-11.webp";
import banner2 from "../../assets/Sliding-Preord.webp";
import banner3 from "../../assets/samsung-s24-ultra-home-20-11.webp";
import image from "../../assets/ss-s24-ultra-xam-222.webp"
import { Products } from "../../interfaces/Products";
import { Link } from "react-router-dom";
import { baseURL } from "../../api";
import ins from "../../api";

const bannerImages = [banner1, banner2, banner3, ];

// Banner Component
const MainBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="mainBanner" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {bannerImages.map((image, index) => (
          <div
            className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            key={index}
          >
            <img src={image} className="w-100 d-block" alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainBanner"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainBanner"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: Products }> = ({ product }) => {
  return (
    <div className="col">
      <div className="card">
        <img
          src={`${baseURL}/images/${product.image}`}
          width="100px"
          height="297px"
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">
            {product.default_price.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <Link to={`/products/${product._id}`} className="btn btn-primary">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

// Product List Component
const ProductList: React.FC<{ products: Products[] }> = ({ products }) => {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product._id} product={product} />)
      ) : (
        <div className="col-12">
          <p className="text-center">Không có sản phẩm nào</p>
        </div>
      )}
    </div>
  );
};

// Categories Component
const Categories: React.FC = () => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [products, setProducts] = useState<Products[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await ins.get(`${baseURL}/categories`);
      if (response.status >= 200 && response.status < 300) {
        setCategories(
          response.data.map((category: any) => ({ _id: category._id, name: category.name }))
        );
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  const fetchProducts = async (categoryId?: string) => {
    try {
      const response = await ins.get(`${baseURL}/products/filters`, {
        params: { category: categoryId },
      });
      if (response.status >= 200 && response.status < 300) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(selectedCategory); // Fetch products based on selected category or no category (for "Tất cả")
  }, [selectedCategory]);

  const handleAllCategories = () => {
    setSelectedCategory(""); // Set to an empty string to load all products
  };

  return (
    <section className="category-section">
      <h2 className="category-title">Danh mục sản phẩm </h2>
      <div className="category-buttons">
        {/* Nút Tất cả */}
        <button
          className={`category-button ${selectedCategory === "" ? "active" : ""}`}
          onClick={handleAllCategories}
        >
          Tất cả
        </button>

        {/* Hiển thị danh sách các category */}
        {categories.length > 0 &&
          categories.map((category) => (
            <button
              key={category._id}
              className={`category-button ${category._id === selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </button>
          ))}
      </div>
      <ProductList products={products} />
    </section>
  );
};


// Deals Component
const Deals: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    ins
      .get(`${baseURL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm: ", error);
      });
  }, []);

  return (
    <section className="mt-5">
      <h2>Sản phẩm</h2>
      <ProductList products={products} />

      {/* Phần video */}
      <div className="mt-4">
        <h3>Review sản phẩm</h3>

        <div className="promo-video-list">
          <div className="promo-video">
            <h4>Review Samsung Galaxy S24</h4>
            <div className="embed-responsive embed-responsive-16by9">
            <iframe
              src="https://www.youtube.com/embed/GntJXsOLU10"
              title="Review Samsung Galaxy S24"
              allowFullScreen
            ></iframe>
            </div>
            <p>Hãy xem video khuyến mãi về Samsung Galaxy S24 với nhiều ưu đãi hấp dẫn.</p>
          </div>

          <div className="promo-video">
            <h4>Review iPhone 15</h4>
            <div className="embed-responsive embed-responsive-16by9">
            <iframe
              src="https://www.youtube.com/embed/9ROeIuDOh4A"
              title="Video Khuyến Mãi 2"
              allowFullScreen
            ></iframe>
            </div>
            <p>Xem video giới thiệu chương trình khuyến mãi iPhone 15 mới nhất!</p>
          </div>

          <div className="promo-video">
            <h4>Review Samsung Galaxy Z Fold 5</h4>
            <div className="embed-responsive embed-responsive-16by9">
            <iframe
              src="https://www.youtube.com/embed/y_pe3ldKB9A"
              title="Video Khuyến Mãi 3"
              allowFullScreen
            ></iframe>
            </div>
            <p>Khám phá các tính năng mới của Galaxy Z Fold 5 qua video khuyến mãi này.</p>
          </div>
        </div>
      </div>
    </section>
  );
};


// Home Page Component
const Home: React.FC = () => {
  return (
    <div className="container-xl bg-white rounded shadow-sm p-4">
      <MainBanner />
      <Categories />

      {/* Promo Article Section */}
      <section className="mt-5">
        <h2>Khuyến mãi giới thiệu điện thoại</h2>
        <div className="promo-article">
          <img src={image} alt="Samsung Galaxy S24 Ultra" className="float-end" />
          <p>
            🌟 <strong>Đón chào dòng điện thoại mới nhất!</strong> Chúng tôi hiện đang có chương
            trình khuyến mãi hấp dẫn cho các sản phẩm điện thoại cao cấp như{" "}
            <strong>iPhone 15</strong>, <strong>Samsung Galaxy S24</strong>, và nhiều thương hiệu
            nổi tiếng khác.
          </p>
          
          <p>
            Với ưu đãi giảm giá lên đến <strong>30%</strong> và quà tặng kèm độc quyền, đây là cơ hội
            tuyệt vời để sở hữu chiếc điện thoại mơ ước với mức giá không thể tốt hơn.
          </p>
          <p>
            Hãy nhanh tay ghé thăm cửa hàng trực tuyến của chúng tôi hoặc đến trực tiếp showroom để
            trải nghiệm sản phẩm. Chương trình khuyến mãi có thời hạn, đừng bỏ lỡ!
          </p>
          <p className="text-end">
            <Link  to="/other" className="btn btn-primary">
              Tìm hiểu thêm
            </Link>
          </p>
        </div>
      </section>
      <Deals />
    </div>
  );
};


export default Home;
