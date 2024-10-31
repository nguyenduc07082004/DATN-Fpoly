import "../.././App.scss";
import { useContext } from "react";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { Link } from "react-router-dom";

const QLDH = () => {
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
        <b className="h2">Quản lý đơn hàng</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4"></div>
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
            <th className="col-3">Tên khách hàng</th>
            <th className="col-3">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-4">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentProducts.map((i, index) => (
            <tr className="d-flex" key={i._id}>
              <td className="col-3">{indexOfFirstProduct + index + 1}</td>
              <td className="col-3">{i.title}</td>
              <td className="col-1">{i.price}</td>
              <td className="col-1">{i.quantity}</td>
              <td className="col-4">
                <select name="" id="">
                  <option value="">Đang chuẩn bị hàng</option>
                  <option value="">Đang giao hàng</option>
                  <option value="">Giao hàng thành công</option>
                </select>
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

export default QLDH;
