import "../.././App.scss";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../api/contexts/UserContext";

const QLTK = () => {
  const {
    handleNextPage,
    handlePrevPage,
    handleSearch,
    currentProducts,
    currentPage,
    totalPages,
    indexOfFirstProduct,
    searchQuery,
  } = useContext(UserContext);

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý tài khoản</b>
      </p>
      <div className="d-flex py-4 mx-5 ">
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
            <th className="col-2">Tên tài khoản</th>
            <th className="col-3">Email</th>
            <th className="col-1">SĐT</th>
            <th className="col-3">Địa chỉ</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i.id}>
              <td className="col-1">{indexOfFirstProduct + index + 1}</td>
              <td className="col-2">{i.fullName}</td>
              <td className="col-3">{i.email}</td>
              <td className="col-1">{i.phone}</td>
              <td className="col-3">{i.address}</td>
              <td className="col-2">
                <button className="action-del rounded">Disable</button>
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

export default QLTK;
