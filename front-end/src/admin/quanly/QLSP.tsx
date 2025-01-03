import "../.././App.scss";
import { useContext, useEffect } from "react";
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
    searchQuery
  } = useContext(ProdContext);

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý sản phẩm</b>
      </p>
      <div className="py-4 d-flex">
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
            <th className="col-3">Ảnh</th>
            <th className="col-1">Số lượng</th>
            <th className="col-2">Loại</th>
            <th className="col-1">Giá</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i._id}>
              <td className="col-1">{indexOfFirstProduct + index + 1}</td>
              <td className="col-2">{i.title}</td>
              <td className="col-3">
                <img
                  src={`${baseURL}/images/` + i.image}
                  alt="error"
                  width="20%"
                />
              </td>
              <td className="col-1">
                {i.variants.reduce(
                  (total, variant) => total + (variant.quantity || 0),
                  0
                )}
              </td>
              <td className="col-2">
                {i.categories
                  ? Array.isArray(i.categories)
                    ? i.categories.map((category) => category.name).join(", ")
                    : i.categories.name
                  : "Không có danh mục"}
              </td>
              <td className="col-1">
                {i.default_price
                  ? `${i.default_price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}`
                  : "Chưa có giá"}
              </td>

              <td className="col-2 d-flex">
                <button className="rounded action-edit">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qlsp/edit/${i._id}`}
                  >
                    Sửa
                  </Link>
                </button>
                <button
                  className="rounded action-del"
                  onClick={() => onDel(String(i._id))}
                >
                  Xóa
                </button>
                <button className="rounded action-details">
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

      <div className="my-4 d-flex justify-content-center align-items-center">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          className="mx-2 btn btn-primary"
        >
          Trang trước
        </button>
        <p className="m-0 mx-2">
          Trang {currentPage} / {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="mx-2 btn btn-primary"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default QLSP;
