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

  return (
    <div>
      <p className="m-3">
        <b className="h2">Chi tiết sản phẩm</b>
      </p>
      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-2">Loại</th>
            <th className="col-1">Bộ nhớ</th>
            <th className="col-1">Màu sắc</th>
            <th className="col-3">Mô tả</th>
            <th className="col-1">Ảnh</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {product?.variants?.map((variant, index) => (
            <tr className="d-flex" key={variant._id || index}>
              <td className="col-2">{product?.title}</td>
              <td className="col-1">{variant.price}</td>
              <td className="col-1">{variant.quantity}</td>
              <td className="col-2">
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
                className="col-3 text-truncate"
                style={{
                  maxWidth: "800px",
                  cursor: "pointer",
                }}
                onClick={() => handleShowModal(product?.description)}
              >
                {product?.description}
              </td>
              <td className="col-1">
                <img src={`${baseURL}/images/${variant?.variantImages[0]?.url}`} alt="error" width="50%" />
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
