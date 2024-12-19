import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Products } from "../../interfaces/Products";
import ins from "../../api";
import DescriptionModal from "../DesModal";
import { baseURL } from "../../api";
import Swal from "sweetalert2";

const Details = () => {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const handleShowModal = (desc: any) => {
    setDescription(desc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDescription("");
  };

  const { id } = useParams();
  const [product, setProduct] = useState<Products | null>(null);

  const fetchProduct = async () => {
    try {
      const { data } = await ins.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleDeleteVariant = async (variantId: string | undefined) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Thao tác này sẽ xóa biến thể và không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await ins.delete(`/products/${id}/variants/${variantId}`);
        await Swal.fire(
          "Đã xóa!",
          "Biến thể đã được xóa thành công.",
          "success"
        );
        // Cập nhật danh sách sản phẩm sau khi xóa
        fetchProduct();
      } catch (error:any) {
        console.error("Lỗi khi xóa biến thể:", error);
        Swal.fire(
          "Lỗi!",
          error.response.data.message,
          "error"
        );
      }
    }
  };

  return (
    <div>
      <p className="m-3">
        <b className="h2">Chi tiết sản phẩm</b>
      </p>
      <button
        className="btn btn-primary m-3"
        onClick={() =>
          (window.location.href = `/admin/details/${id}/variant/add`)
        }
      >
        Thêm mới biến thể
      </button>
      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-1">Giá (VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-1">Loại</th>
            <th className="col-1">Bộ nhớ</th>
            <th className="col-1">Màu sắc</th>
            <th className="col-2">Mô tả</th>
            <th className="col-1">Ảnh</th>
            <th className="col-2">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {product?.variants?.map((variant, index) => (
            <tr className="d-flex" key={variant._id || index}>
              <td className="col-2">{product?.title}</td>
              <td className="col-1">{variant.price}</td>
              <td className="col-1">{variant.quantity}</td>
              <td className="col-1">
                {product?.categories
                  ? Array.isArray(product?.categories)
                    ? product.categories
                        .map((category) => category.name)
                        .join(", ")
                    : product.categories.name
                  : "Không có danh mục"}
              </td>
              <td className="col-1">{variant.storage}</td>
              <td className="col-1">{variant.color}</td>
              <td
                className="col-2 text-truncate"
                style={{
                  maxWidth: "800px",
                  cursor: "pointer",
                }}
                onClick={() => handleShowModal(product?.description)}
              >
                {product?.description}
              </td>
              <td className="col-1">
                <img
                  src={`${baseURL}/images/${variant?.variantImages[0]?.url}`}
                  alt="error"
                  width="50%"
                />
              </td>
              <td className="col-2">
                <Link to={`/admin/details/${id}/variant/edit/${variant._id}`}>
                  <button className="btn btn-warning btn-sm">Sửa</button>
                </Link>
                <button
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => handleDeleteVariant(variant._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DescriptionModal
        show={showModal}
        handleClose={handleCloseModal}
        description={description}
      />
    </div>
  );
};

export default Details;
