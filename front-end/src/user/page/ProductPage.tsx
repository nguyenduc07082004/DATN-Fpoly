import { useEffect, useState } from "react";
import { Products } from "../../interfaces/Products";
import { baseURL } from "../../api";
import ins from "../../api";
import Pagination from "./Pagination"; 
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]); 
  const [rating, setRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ins.get(`${baseURL}/products/filters`, {
        params: {
          page,
          limit: 10,
          searchTerm,
          rating,
          category: selectedCategory,
          min_price: priceRange[0],
          max_price: priceRange[1],
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setProducts(response.data.products); 
        setTotalPages(response.data.totalPages); 
      } else {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ins.get(`${baseURL}/categories`);
        if (response.status >= 200 && response.status < 300) {
          setCategories(response.data); 
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger py-4">Error: {error}</div>;
  }

  return (
    <div className="container-fluid bg-white  rounded shadow-sm my-4 p-4">
      <div className="row d-flex">
        <div className="flex-column col-md-3 d-flex">
          <div className="bg-light rounded h-100 shadow p-4 filter-box">
            <h5 className="text-center mb-3">Tìm kiếm sản phẩm</h5>
            <form onSubmit={handleSearchSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <h5 className="mt-4">Lọc theo danh mục</h5>
              <div className="mb-3">
                <select
                  className="form-control"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <option key={category} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <h5 className="mt-4">Lọc theo giá</h5>
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="form-range"
                />
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="form-range"
                />
                <div className="d-flex justify-content-between">
                  <span>{`${priceRange[0].toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}`}</span>
                  <span>{`${priceRange[1].toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}`}</span>
                </div>
              </div>

              <h5 className="mt-4">Lọc theo đánh giá</h5>
              <div className="mb-3">
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="form-control"
                >
                  <option value={0}>Tất cả đánh giá</option>
                  <option value={1}>1 ⭐ trở lên</option>
                  <option value={2}>2 ⭐ trở lên</option>
                  <option value={3}>3 ⭐ trở lên</option>
                  <option value={4}>4 ⭐ trở lên</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>
              <button type="submit" className="w-100 btn btn-primary">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row">
            {products?.length === 0 ? (
              <div className="text-center col-12">
                <p>Không có sản phẩm nào</p>
              </div>
            ) : (
              products?.map((product) => (
                <div key={product._id} className="mb-4 col-md-4">
                  <div className="card">
                    <img
                      src={`${baseURL}/images/${product.image}`}
                      alt={product.title}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{product.title}</h5>
                      <h6 className="text-success fw-bold">{`${product.default_price.toLocaleString(
                        "vi",
                        { style: "currency", currency: "VND" }
                      )}`}</h6>
                      <div>
                        <strong>Đánh giá:</strong>
                        <p>{product.averageRating} / 5⭐</p>
                      </div>
                    </div>
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-primary"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
