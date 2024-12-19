import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Thêm SweetAlert2
import ins from "../../api";
import { baseURL } from "../../api";

const TrashPage = () => {
  const [deletedItems, setDeletedItems] = useState({
    categories: [],
    products: [],
    variants: [],
  });
  const [activeTab, setActiveTab] = useState("categories");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDeletedItems = async () => {
      try {
        const response = await ins.get(`${baseURL}/trash`);
        setDeletedItems(response.data);
      } catch (error) {
        console.error("Error fetching deleted items:", error);
      }
    };

    fetchDeletedItems();
  }, []);

  const handleRefund = async (id, type) => {
    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: "Xác nhận phục hồi?",
      text: "Bạn có chắc chắn muốn phục hồi mục này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Phục hồi",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await ins.put(`${baseURL}/trash/restore/${type}/${id}`);
        setDeletedItems((prev) => ({
          ...prev,
          [type]: prev[type].filter((item) => item._id !== id),
        }));

        await Swal.fire("Thành công!", "Mục đã được phục hồi.", "success");
      } catch (error) {
        console.error("Error restoring item:", error);
        await Swal.fire("Thất bại!", "Không thể phục hồi mục này.", "error");
      }
    }
  };

  const currentItems = deletedItems[activeTab].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(deletedItems[activeTab].length / itemsPerPage);

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4 text-center">Quản lý Thùng rác</h1>

      <div className="d-flex justify-content-center mb-3">
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "categories" && "active"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Danh mục
        </button>
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "products" && "active"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Sản phẩm
        </button>
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "variants" && "active"
          }`}
          onClick={() => setActiveTab("variants")}
        >
          Biến thể
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Ngày bị xóa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.title || item.name || (`${item.sku}`)}</td>
                  <td>{new Date(item.deleted_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRefund(item._id, activeTab)}
                    >
                      Phục hồi
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có dữ liệu bị xóa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Trước
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, idx) => (
              <li
                className={`page-item ${
                  currentPage === idx + 1 && "active"
                }`}
                key={idx}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TrashPage;
