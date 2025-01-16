import "../.././App.scss";
import { useContext } from "react";

import { Link } from "react-router-dom";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import { baseURL } from "../../api";

const QLDM = () => {
  
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
  } = useContext(CategoryContext);

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý danh mục</b>
      </p>
      <div className="py-4 d-flex">
        <div className="mx-4">
          <button className="rounded">
            <Link
              to="/admin/qldm/add"
              className="text-decoration-none text-dark"
            >
              Thêm danh mục
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
            <th className="col-2">Hình ảnh</th> 
            <th className="col-2">Tên danh mục</th>
            <th className="col-2">Slug</th>
            <th className="col-3">Trạng thái</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i._id}>
              <td className="col-1">{indexOfFirstProduct + index + 1}</td>
              
              {/* Cột hình ảnh */}
              <td className="col-2">
                {i.image ? (
                  <img 
                    src={`${baseURL}/images/${i.image}`} 
                    alt={i.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </td>

              <td className="col-2">{i.name}</td>
              <td className="text-truncate col-2" style={{ maxWidth: "800px" }}>
                {i.slug}
              </td>
              <td className="col-3">
                {i.status === "active" ? (
                  <span style={{ color: "green" }}>✔️</span>
                ) : (
                  <span style={{ color: "red" }}>❌</span>
                )}
              </td>
              <td className="col-2">
                <button className="rounded action-edit">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qldm/edit/${i._id}`}
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

export default QLDM;
