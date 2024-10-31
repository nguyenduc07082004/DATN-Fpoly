import React, { BaseSyntheticEvent, useContext, useState } from "react";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { useForm } from "react-hook-form";
import { Products } from "../../interfaces/Products";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import { useParams } from "react-router-dom";

const productSchema = z.object({
  title: z.string().min(6, { message: "Tên sản phẩm phải lớn hơn 6 ký tự" }),
  price: z.number().min(0, { message: "Giá sản phẩm phải lớn hơn 0" }),
  quantity: z.number().min(0, { message: "Số lượng sản phẩm phải lớn hơn 0" }),
  image: z.string().optional(),
  categories: z.string().min(1, { message: "Danh mục không được để trống" }),
  description: z.string().optional(),
  storage: z.string(),
  color: z.string(),
});
const storage = [
  { _id: "1", options: "128GB" },
  { _id: "2", options: "256GB" },
  { _id: "3", options: "512GB" },
  { _id: "4", options: "1TB" },
];
const color = [
  { _id: "1", options: "Đen" },
  { _id: "2", options: "Trắng" },
  { _id: "3", options: "Hồng" },
  { _id: "4", options: "Xanh" },
];
const QLBL = () => {
  const { onSubmitProduct, onChangeHandler, setImage, data1 } =
    useContext(ProdContext);
  const { data } = useContext(CategoryContext);
  // const [image, setImage] = useState<File | null>(null);
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Products>({
    resolver: zodResolver(productSchema),
  });
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.options[event.target.selectedIndex].text);
    console.log(event.target.options[event.target.selectedIndex].text);
  };
  return (
    <div>
      <form onSubmit={(e) => onSubmitProduct(data1, e)}>
        <div className="m-5 d-flex">
          <div className="form-group">
            <label htmlFor="title">Tên sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="text"
              placeholder="Tên sản phẩm"
              // onChange={onChangeHandler}
              // name="title"
              // value={data1.title}
              // required
              {...register("title", {
                required: true,
                onChange: onChangeHandler,
              })}
            />
            {errors.title && <span>{errors.title.message}</span>}
          </div>

          <div className="form-group category">
            <label htmlFor="categories">Danh mục</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              onChange={(event) => {
                handleCategoryChange(event);
                onChangeHandler(event);
              }}
            >
              <option value="0">-----</option>
              {data.category.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group category">
            <label htmlFor="storage">Dung lượng</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              onChange={onChangeHandler}
              name="storage"
            >
              {selectedCategory === "Phụ kiện" &&
                storage.map((i) => (
                  <option disabled value={i.options}>
                    {i.options}
                  </option>
                ))}
              {selectedCategory === "Điện thoại" &&
                storage.map((i) => (
                  <option value={i.options}>{i.options}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="m-5 d-flex">
          <div className="form-group price">
            <label htmlFor="price">Giá sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              type="number"
              placeholder="Giá sản phẩm"
              // onChange={onChangeHandler}
              // name="price"
              // required
              // value={data1.price}
              {...register("price", {
                required: true,
                onChange: onChangeHandler,
                valueAsNumber: true,
              })}
            />
            {errors.price && <span>{errors.price.message}</span>}
          </div>
          <div className="form-group quantity">
            <label htmlFor="price">Số lượng</label>
            <input
              className="form-control"
              type="number"
              placeholder="Số lượng sản phẩm"
              style={{ width: "200px", height: "50px" }}
              // onChange={onChangeHandler}
              // name="quantity"
              // required
              // value={data1.quantity}
              {...register("quantity", {
                required: true,
                onChange: onChangeHandler,
                valueAsNumber: true,
              })}
            />
            {errors.quantity && <span>{errors.quantity.message}</span>}
          </div>
          <div className="form-group category">
            <label htmlFor="image">Ảnh sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              type="file"
              name="image"
              onChange={(e: BaseSyntheticEvent) => {
                onChangeHandler(e);
                setImage(true);
              }}
            />
          </div>
          <div className="form-group category">
            <label htmlFor="specialFeature">Màu</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              onChange={onChangeHandler}
              name="color"
            >
              {selectedCategory === "Phụ kiện" &&
                color.map((i) => (
                  <option disabled value={i.options}>
                    {i.options}
                  </option>
                ))}
              {selectedCategory === "Điện thoại" &&
                color.map((i) => (
                  <option value={i.options}>{i.options}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="m-5 d-flex">
          <div className="form-group desc">
            <label htmlFor="description">Mô tả sản phẩm</label>
            <textarea
              className="form-control"
              cols={100}
              rows={3}
              style={{ width: "500px" }}
              placeholder="Mô tả sản phẩm"
              onChange={onChangeHandler}
              name="description"
              value={data1.description}
            />
            {errors.description && <span>{errors.description.message}</span>}
          </div>
          <button
            className="btn btn1"
            style={{
              width: "500px",
              height: "50px",
              backgroundColor: "#FF5151",
              color: "white",
            }}
            type="submit"
          >
            ok
          </button>
        </div>
      </form>
    </div>
  );
};

export default QLBL;
