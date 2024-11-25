import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ins from "../../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import { Category } from "../../interfaces/Category";
import { generateSlug } from "../../utils/slugUtils"; 

const cateSchema = z.object({
  name: z.string().min(6, { message: "Tên danh mục phải lớn hơn 6 ký tự" }),
  note: z.string().optional(),
  slug: z.string().min(1, { message: "Slug không thể trống" }),
});

const CateForm = () => {
  const { onSubmitCategory } = useContext(CategoryContext);
  const { id } = useParams();
  const [slug, setSlug] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Category>({
    resolver: zodResolver(cateSchema),
  });

  // Lấy dữ liệu từ API khi có id
  useEffect(() => {
    if (id) {
      (async () => {
        const data = await ins.get(`/categories/${id}`);
        reset(data.data);
        setSlug(data.data.slug); // Cập nhật slug nếu có
      })();
    }
  }, [id, reset]);

  // Khi tên thay đổi, tự động tạo slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue("name", newName);
    const newSlug = generateSlug(newName); // Sử dụng hàm generateSlug
    setSlug(newSlug);
    setValue("slug", newSlug); // Cập nhật slug trong form
  };

  return (
    <div>
      <p className="m-3">
        {id ? <h2>Cập nhật danh mục</h2> : <h2>Thêm mới danh mục</h2>}
      </p>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmitCategory({ ...data, _id: id as string, status: "active" })
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
              onChange={handleNameChange}
            />
            {errors.name && <span>{errors.name.message?.toString()}</span>}
          </div>
        </div>

        <div className=" m-5">
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              className="form-control"
              style={{ width: "1140px", height: "50px" }}
              type="text"
              placeholder="Slug"
              {...register("slug", { required: true })}
              value={slug}
              readOnly
            />
            {errors.slug && <span>{errors.slug.message}</span>}
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
