import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Products } from "../../interfaces/Products";
import ins from "../../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProdContext } from "../../api/contexts/ProductsContexts";

const productSchema = z.object({
  title: z.string().min(6, { message: "Tên sản phẩm phải lớn hơn 6 ký tự" }),
  price: z.number().min(0, { message: "Giá sản phẩm phải lớn hơn 0" }),
  stock: z.number().min(0, { message: "Số lượng sản phẩm phải lớn hơn 0" }),
  description: z.string().optional(),
});

const Form = () => {
  const { onSubmitProduct } = useContext(ProdContext);
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
      })();
    }, [id]);
  }
  return (
    <div>
      <p className="m-3">
        {id ? <h2>Cập nhật sản phẩm</h2> : <h2>Thêm mới sản phẩm</h2>}
      </p>
      <form onSubmit={handleSubmit((data) => onSubmitProduct({ ...data, id }))}>
        <div className="d-flex m-5">
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

          <div className="form-group stock">
            <label htmlFor="price">Số lượng sản phẩm</label>
            <input
              className="form-control"
              type="number"
              placeholder="Số lượng sản phẩm"
              style={{ width: "500px", height: "50px" }}
              {...register("stock", { required: true, valueAsNumber: true })}
            />
            {errors.stock && <span>{errors.stock.message}</span>}
          </div>
        </div>

        <div className="d-flex m-5">
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

        <div className="d-flex m-5">
          <div className="form-group img">
            <label htmlFor="price">Ảnh sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="file"
            />
          </div>
          <button
            className="btn1 btn"
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
