import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ins from "../../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import { Category } from "../../interfaces/Category";

const cateSchema = z.object({
  name: z.string().min(6, { message: "Tên danh mục phải lớn hơn 6 ký tự" }),
  note: z.string().optional(),
});

const CateForm = () => {
  const { onSubmitCategory } = useContext(CategoryContext);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Category>({
    resolver: zodResolver(cateSchema),
  });
  if (id) {
    useEffect(() => {
      (async () => {
        const data = await ins.get(`/categories/${id}`);
        reset(data.data);
      })();
    }, [id]);
  }
  return (
    <div>
      <p className="m-3">
        {id ? <h2>Cập nhật danh mục</h2> : <h2>Thêm mới danh mục</h2>}
      </p>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmitCategory({ ...data, _id: id })
        )}
      >
        <div className=" m-5">
          <div className="form-group">
            <label htmlFor="name">Tên danh mục</label>
            <input
              className="form-control"
              style={{ width: "1140px", height: "50px" }}
              type="text"
              placeholder="Tên danh mục"
              {...register("name", { required: true })}
            />
            {errors.name && <span>{errors.name.message?.toString()}</span>}
          </div>
        </div>

        <div className=" m-5">
          <div className="form-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              className="form-control"
              cols={100}
              rows={3}
              style={{ width: "1140px" }}
              placeholder="Ghi chú"
              {...register("note", { required: true })}
            />
            {errors.note && <span>{errors.note.message}</span>}
          </div>
        </div>

        <div className="m-5">
          <button
            className="btn"
            style={{
              width: "1140px",
              height: "50px",
              backgroundColor: "#FF5151",
              color: "white",
            }}
            type="submit"
          >
            {id ? <h5>Cập nhật danh mục</h5> : <h5>Thêm mới danh mục</h5>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CateForm;
