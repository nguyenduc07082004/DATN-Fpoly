import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  
import { baseURL } from "../../api";
import ins from "../../api";  

interface Category {
  _id: string;
  name: string;
  image: string;  // Hình ảnh đại diện cho danh mục
}

// Component Category (Danh mục sản phẩm)
const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch dữ liệu danh mục từ API
  useEffect(() => {
    ins.get(`${baseURL}/categories`) // Thay bằng endpoint API lấy danh mục
      .then((response) => {
        setCategories(response.data); // Set dữ liệu vào state
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu danh mục: ", error);
      });
  }, []);

  return (
    <section className="category-list">
      <h2 className="text-center mb-4">Danh mục sản phẩm</h2>
      <div className="row row-cols-2 row-cols-md-4 g-4"> {/* Hiển thị 2 sản phẩm mỗi hàng trên màn hình nhỏ và 4 trên màn hình lớn */}
        {/* Lặp qua các danh mục và hiển thị */}
        {categories.map((category) => (
          <div key={category._id} className="col">
            <Link
              to={`/category/${category._id}`}  // Điều hướng đến trang danh mục chi tiết
              className="category-card text-decoration-none text-dark d-block"
            >
              <div className="category-image overflow-hidden rounded">
                <img
                  src={`${baseURL}/images/${category.image}`}  // Link hình ảnh của danh mục
                  alt={category.name}
                  className="category-img img-fluid"  // Đảm bảo hình ảnh hiển thị đúng kích thước
                />
              </div>
              <h3 className="category-name text-center mt-2">{category.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
