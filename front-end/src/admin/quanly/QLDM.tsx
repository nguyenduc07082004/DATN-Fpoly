import "../.././App.scss";
import { useContext, useState } from "react";

import { Link } from "react-router-dom";
import { CategoryContext } from "../../api/contexts/CategoryContext";

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
      <div className="d-flex py-4">
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
            <th className="col-3">Tên danh mục</th>
            <th className="col-6">Ghi chú</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i._id}>
              <td className="col-1">{indexOfFirstProduct + index + 1}</td>
              <td className="col-3">{i.name}</td>
              <td className="col-6 text-truncate" style={{ maxWidth: "800px" }}>
                {i.note}
              </td>
              <td className="col-2">
                <button className="action-edit rounded">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qldm/edit/${i._id}`}
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

export default QLDM;
