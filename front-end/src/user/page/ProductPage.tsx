import { useEffect, useState } from "react";
import { Products } from "../../interfaces/Products";
import { baseURL } from "../../api";
import ins from "../../api";
import Pagination from "./Pagination"; // Import Pagination component

const ProductPage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Keep search term in state
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 10000]); // Initial range 5000 to 10000
  const [rating, setRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch products
  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ins.get(`${baseURL}/products/filters`, {
        params: { 
          page, 
          limit: 10, 
          searchTerm, 
          minPrice: priceRange[0], 
          maxPrice: priceRange[1], 
          rating 
        }
      });
      if (response.status >= 200 && response.status < 300) {
        setProducts(response.data.data);
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

  // Fetch products when the component mounts or when the page number changes
  useEffect(() => {
    fetchProducts(currentPage); 
  }, [currentPage]);

  // Handle form submit to fetch products based on filters
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from reloading the page
    setCurrentPage(1); // Reset to first page when submitting a new search
    fetchProducts(1); // Fetch products with the current search and filters
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-4">
      <div className="row d-flex">
        {/* Search and Filter Sidebar */}
        <div className="col-md-3 d-flex flex-column">
          <div className="filter-box p-4 bg-light shadow rounded h-100">
            <h5 className="mb-3 text-center">Tìm kiếm sản phẩm</h5>
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

              <h5 className="mt-4">Lọc theo giá</h5>
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="form-range"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="form-range"
                />
                <div className="d-flex justify-content-between">
                  <span>{`${priceRange[0]} VND`}</span>
                  <span>{`${priceRange[1]} VND`}</span>
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
                  <option value={1}>1 Sao</option>
                  <option value={2}>2 Sao</option>
                  <option value={3}>3 Sao</option>
                  <option value={4}>4 Sao</option>
                  <option value={5}>5 Sao</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-md-9">
          <h1 className="text-center mb-4">Tất cả sản phẩm</h1>

          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="col-md-3 mb-4" key={product._id}>
                  <div className="card shadow-sm">
                    <img
                      src={`${baseURL}/images/` + product.image}
                      alt={product.title}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text">{product.priceRange} VND</p>
                      <div className="rating">
                        <span>{product.averageRating} ⭐</span>
                      </div>
                      <button className="btn btn-warning w-100">Xem chi tiết</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">No products found</div>
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
