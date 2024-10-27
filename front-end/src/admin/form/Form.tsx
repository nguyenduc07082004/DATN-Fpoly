import { useContext, useEffect } from "react";
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
  imageURL: z.string().optional(),
  categories: z.string(),
  description: z.string().optional(),
});

const Form = () => {
  const { onSubmitProduct } = useContext(ProdContext);
  const { data } = useContext(CategoryContext);
  const { id } = useParams();

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
        onSubmit={handleSubmit((data) => onSubmitProduct({ ...data, _id: id }))}
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

          <div className="form-group quantity">
            <label htmlFor="categories">Danh mục</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              {...register("categories", {
                required: true,
              })}
            >
              <option value="0">-----</option>
              {data.category.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="m-5 d-flex">
          <div className="form-group price">
            <label htmlFor="price">Giá sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="number"
              placeholder="Giá sản phẩm"
              {...register("price", { required: true, valueAsNumber: true })}
            />
            {errors.price && <span>{errors.price.message}</span>}
          </div>

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
        </div>

        <div className="m-5 d-flex">
          <div className="form-group img">
            <label htmlFor="price">Ảnh sản phẩm</label>
            <input
              placeholder="ảnh sản phẩm"
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="file"
            />
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
