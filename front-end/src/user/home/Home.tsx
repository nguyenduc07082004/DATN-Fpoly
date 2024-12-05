import { useState, useEffect } from "react";
import "../css/Style.css";

import banner1 from "../../assets/banner.jpg";
import banner2 from "../../assets/banner1.jpg";
import banner3 from "../../assets/banner 2.jpg";
import { Products } from "../../interfaces/Products";
import { Link } from "react-router-dom";
import { baseURL } from "../../api";
import ins from "../../api";
const bannerImages = [banner1, banner2, banner3,];

// Banner Component
const MainBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="mainBanner" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {bannerImages.map((image, index) => (
          <div className={`carousel-item ${index === currentIndex ? 'active' : ''}`} key={index}>
            <img src={image} className="d-block w-100" alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#mainBanner" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#mainBanner" data-bs-slide="next">
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
        <img src={`${baseURL}/images/${product.image}`} className="card-img-top" alt={product.title} />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.default_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
          <Link to={`/products/${product._id}`} className="btn btn-primary">Xem chi tiết</Link>
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
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [products, setProducts] = useState<Products[]>([]);


  const fetchCategories = async () => {
    try {
      const response = await ins.get(`${baseURL}/categories`);
      if (response.status >= 200 && response.status < 300) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }
  const fetchProducts = async () => {
    try {
      const response = await ins.get(`${baseURL}/products/filters` , {params: {category: selectedCategory}});
      if (response.status >= 200 && response.status < 300) {
        setProducts(response.data.products);
        console.log(response.data.products)
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }
  useEffect(() => {
   fetchCategories();
   fetchProducts();
  }, [selectedCategory]);

  return (
    <section className="mt-5">
      <h2>Danh mục sản phẩm</h2>
      <div className="btn-group" role="group" aria-label="Categories">
        {categories.length > 0 && categories.map((category) => (
          <button 
            key={category._id} 
            type="button" 
            className={`btn ${category._id === selectedCategory ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <h3 className="mt-4">
        <ProductList products={products} />
      </h3>
    </section>
  );
};

// Deals Component
const Deals: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    ins.get(`${baseURL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm: ", error);
      });
  }, []);

  return (
    <section className="mt-5">
      <h2>Khuyến mãi Online</h2>
      <ProductList products={products} />
      
      {/* Phần video */}
      <div className="mt-4">
        <h3>Video khuyến mãi</h3>
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            className="embed-responsive-item"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Video Khuyến Mãi"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

// Home Page Component
const Home: React.FC = () => {
  return (
    <div>
      <MainBanner />
      <Categories />
      <Deals />
    </div>
  );
};

export default Home;
