import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Products } from "../../interfaces/Products";
import ins from "../../api";
import DescriptionModal from "../DesModal";
import { baseURL } from "../../api";

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

  useEffect(() => {
    const getProduct = async () => {
      const { data } = await ins.get(`/products/${id}`);
      setProduct(data);
    };
    getProduct();
  }, [id]);

  const handleEditVariant = (variant) => {
    // Mở modal hoặc thực hiện hành động sửa
    console.log("Sửa variant:", variant);
    // Ví dụ, bạn có thể hiển thị modal để sửa thông tin variant
    // setShowEditModal(true);
    // setCurrentVariant(variant);
  };
  
  // Xử lý xóa variant
  const handleDeleteVariant = (variantId) => {
    // Thực hiện hành động xóa (gọi API hoặc cập nhật trạng thái)
    console.log("Xóa variant có ID:", variantId);
    // Ví dụ, bạn có thể xác nhận trước khi xóa:
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      // Thực hiện xóa, ví dụ gọi API xóa hoặc cập nhật lại danh sách variants
      // deleteVariant(variantId);
    }
  };
  return (
    <div>
      <p className="m-3">
        <b className="h2">Chi tiết sản phẩm</b>
      </p>
      <button className = "btn btn-primary m-3" onClick = {() => window.location.href = "/admin/qlsp/variants"}>Thêm mới biến thể</button>
      <table className="table">
  <thead className="text-center">
    <tr className="d-flex">
      <th className="col-2">Tên sản phẩm</th>
      <th className="col-1">Giá(VND)</th>
      <th className="col-1">Số lượng</th>
      <th className="col-1">Loại</th>
      <th className="col-1">Bộ nhớ</th>
      <th className="col-1">Màu sắc</th>
      <th className="col-2">Mô tả</th>
      <th className="col-1">Ảnh</th>
      <th className="col-2">Thao tác</th> {/* Cột Thao tác mới */}
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
          {/* Các nút thao tác */}
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEditVariant(variant)}
          >
            Sửa
          </button>
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
