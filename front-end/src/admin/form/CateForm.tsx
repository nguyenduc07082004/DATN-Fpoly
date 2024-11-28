import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import ins, { baseURL } from "../../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category } from "../../interfaces/Category";
import { generateSlug } from "../../utils/slugUtils";

// Import MUI components
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const cateSchema = z.object({
  name: z.string().min(6, { message: "Tên danh mục phải lớn hơn 6 ký tự" }),
  slug: z.string().min(1, { message: "Slug không thể trống" }),
  image: z.instanceof(File).optional(),
});

const CateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [openModal, setOpenModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 
  const [isSuccess, setIsSuccess] = useState(true); 
  const {
    register,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm<Category>({
    resolver: zodResolver(cateSchema),
  });

  // Lấy dữ liệu từ API khi có id
  useEffect(() => {
    if (id) {
      (async () => {
        const data = await ins.get(`/categories/${id}`);
        reset(data.data);
        setSlug(data.data.slug);
        if (data.data.image) {
          setImage(data.data.image);
        }
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

  // Hàm xử lý thay đổi ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("image", { message: "Vui lòng chọn một tệp ảnh" });
      } else {
        setImage("");
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // Hàm xử lý submit form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", slug);
    formData.append("slug", slug);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (id) {
        await ins.put(`/categories/edit/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await ins.post(`${baseURL}/categories/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsSuccess(true);
      setModalMessage(id ? "Cập nhật danh mục thành công!" : "Thêm mới danh mục thành công!");
    } catch (error: any) {
      console.error("Lỗi khi gửi form:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      setIsSuccess(false);
      setModalMessage(errorMessage);
    } finally {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (isSuccess) {
      window.location.href = "/admin/qldm";
    }
  };
  return (
    <div>
      <h2 className="m-3">{id ? "Cập nhật danh mục" : "Thêm mới danh mục"}</h2>
      <form onSubmit={onSubmit}>
        <div className="m-5 row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name">Tên danh mục</label>
            <input
              className="form-control"
              style={{ width: "100%" }}
              type="text"
              placeholder="Tên danh mục"
              {...register("name", { required: true })}
              onChange={handleNameChange}
            />
            {errors.name && <span className="text-danger">{errors.name.message}</span>}
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-6 mb-3">
            <label htmlFor="slug">Slug</label>
            <input
              className="form-control"
              style={{ width: "100%" }}
              type="text"
              placeholder="Slug"
              {...register("slug", { required: true })}
              value={slug}
              readOnly
            />
            {errors.slug && <span className="text-danger">{errors.slug.message}</span>}
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-6 mb-3">
            <label htmlFor="image">Hình ảnh</label>
            <input
              className="form-control"
              style={{ width: "100%" }}
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
            />
            {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
            {image && <img src={`${baseURL}/images/${image}`} alt="Image" width="100" />}
            {errors.image && <span className="text-danger">{errors.image.message}</span>}
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-12 mb-3">
            <button
              className="btn btn-danger btn-block"
              style={{ width: "100%", height: "50px" }}
              type="submit"
            >
              {id ? <h5>Cập nhật danh mục</h5> : <h5>Thêm mới danh mục</h5>}
            </button>
          </div>
        </div>
      </form>

      {/* MUI Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{isSuccess ? "Thành công!" : "Thất bại!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color={isSuccess ? "primary" : "secondary"}>
            {isSuccess ? "OK" : "Đóng"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CateForm;
