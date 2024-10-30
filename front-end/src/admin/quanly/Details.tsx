import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Products } from "../../interfaces/Products";
import ins from "../../api";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Products | null>(null);
  useEffect(() => {
    const getProduct = async () => {
      const { data } = await ins.get(`/products/${id}`);
      setProduct(data);
      console.log(data);
    };
    getProduct();
  }, []);
  return (
    <div>
      <p className="m-3">
        <b className="h2">Chi tiết sản phẩm</b>
      </p>
      <div>
        <p>TÊN SẢN PHẨM: {product?.title}</p>
        <p>GIÁ: {product?.price}</p>

        <p>
          DANH MỤC:{" "}
          {product?.categories
            ? Array.isArray(product?.categories)
              ? product.categories.map((category) => category.name).join(", ")
              : product.categories.name
            : "Không có danh mục"}
        </p>
        {product?.categories.name === "Điện thoại" && (
          <>
            <p>DUNG LƯỢNG: {product?.storage}</p>
            <p>MÀU SẮC: {product?.color}</p>
          </>
        )}
        <p>MÔ TẢ: {product?.description}</p>
        <p>SỐ LƯỢNG: {product?.quantity}</p>
      </div>
    </div>
  );
};

export default Details;
