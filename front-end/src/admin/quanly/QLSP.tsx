import "../.././App.scss";
import { useContext } from "react";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { Link } from "react-router-dom";
import { baseURL } from "../../api";

const QLSP = () => {
  const {
    onDel,
    handleNextPage,
    handlePrevPage,
    handleSearch,
    currentProducts = [],
    currentPage,
    totalPages,
    indexOfFirstProduct,
    searchQuery,
  } = useContext(ProdContext);

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý sản phẩm</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4">
          <button className="rounded">
            <Link
              to="/admin/qlsp/add"
              className="text-decoration-none text-dark"
            >
              Thêm sản phẩm
            </Link>
          </button>
        </div>
        <div className="search">
          Search
          <input
            className="rounded"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-1">Ảnh</th>
            <th className="col-1">Số lượng</th>
            <th className="col-2">Loại</th>
            <th className="col-4">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i._id}>
              <td className="col-1">{indexOfFirstProduct + index + 1}</td>
              <td className="col-2">{i.title}</td>
              <td className="col-1">{i.price}</td>
              <td className="col-1">
                <img
                  src={`${baseURL}/images/` + i.image}
                  alt="error"
                  width="50%"
                />
              </td>
              <td className="col-1">{i.quantity}</td>
              <td className="col-2">
                {i.categories
                  ? Array.isArray(i.categories)
                    ? i.categories.map((category) => category.name).join(", ")
                    : i.categories.name
                  : "Không có danh mục"}
              </td>

              <td className="col-4 d-flex">
                <button className="action-edit rounded">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qlsp/edit/${i._id}`}
                  >
                    Sửa
                  </Link>
                </button>
                <button
                  className="action-del rounded"
                  onClick={() => onDel(String(i._id))}
                >
                  Xóa
                </button>
                <button className="action-details rounded">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/details/${i._id}`}
                  >
                    Chi tiết
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center align-items-center my-4">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          className="btn btn-primary mx-2"
        >
          Trang trước
        </button>
        <p className="m-0 mx-2">
          Trang {currentPage} / {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="btn btn-primary mx-2"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default QLSP;
