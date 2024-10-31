import { BaseSyntheticEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Products } from "../../interfaces/Products";
import ins from "../../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { CategoryContext } from "../../api/contexts/CategoryContext";

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

const Form = () => {
  const { onSubmitProduct } = useContext(ProdContext);
  const { data } = useContext(CategoryContext);
  // const [image, setImage] = useState<File | null>(null);
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.options[event.target.selectedIndex].text);
    console.log(event.target.options[event.target.selectedIndex].text);
  };
  // const imageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   if (file) {
  //     setImage(file);
  //     const formData = new FormData();
  //     formData.append("image", file);
  //     try {
  //       const res = await ins.post(`/products/add`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log(res);
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     }
  //   }
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Products>({
    resolver: zodResolver(productSchema),
  });
  if (id) {
    useEffect(() => {
      (async () => {
        const data = await ins.get(`/products/${id}`);
        reset(data.data);
        console.log(data.data);
      })();
    }, [id, reset]);
  }

  return (
    <div>
      <p className="m-3">
        {id ? <h2>Cập nhật sản phẩm</h2> : <h2>Thêm mới sản phẩm</h2>}
      </p>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmitProduct({ ...data, _id: id });
        })}
      >
        <div className="m-5 d-flex">
          <div className="form-group">
            <label htmlFor="title">Tên sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="text"
              placeholder="Tên sản phẩm"
              {...register("title", { required: true })}
            />
            {errors.title && <span>{errors.title.message}</span>}
          </div>

          <div className="form-group category">
            <label htmlFor="categories">Danh mục</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              {...register("categories", {
                required: true,
              })}
              onChange={handleCategoryChange}
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
              {...register("storage")}
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
              {...register("price", { required: true, valueAsNumber: true })}
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
              {...register("quantity", { required: true, valueAsNumber: true })}
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
              // {...register("image", { required: true, onChange: imageUpload })}
            />
          </div>
          <div className="form-group category">
            <label htmlFor="specialFeature">Màu</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              {...register("color")}
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
              {...register("description", { required: true })}
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
            {id ? <h5>Cập nhật sản phẩm</h5> : <h5>Thêm mới sản phẩm</h5>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
