import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { CategoryContext } from "../../api/contexts/CategoryContext";

const AddForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    categories: "", 
    description: "",
  });

  const { dataDM } = useContext(CategoryContext); 
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cập nhật state formData khi có thay đổi
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: event.target.value, 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.title || !formData.categories) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }
  
    // Chuyển dữ liệu thành FormData
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("categories", formData.categories);
    formDataToSend.append("description", formData.description);
  
    // Chuyển variants thành JSON string và gửi
  
    if (image) {
      formDataToSend.append("image", image);
    }
  
    try {
      await axios.post(
        `http://localhost:8000/products/add`, 
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      alert("Sản phẩm đã được thêm thành công!");
      window.location.href = "/admin/qlsp";
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  useEffect(() => {
    if (dataDM && dataDM.category.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        categories: dataDM.category[0]._id, 
      }));
    }
  }, [dataDM]);

  return (
    <div>
      <h2 className="m-3">Thêm mới sản phẩm</h2>
      <button className = "btn btn-primary m-3" onClick = {() => window.location.href = "/admin/qlsp/variants"}>Thêm mới biến thể</button>
      <form onSubmit={handleSubmit}>
        <div className="m-5 row">
          <div className="col-md-6 mb-3">
            <label htmlFor="title">Tên sản phẩm</label>
            <input
              className="form-control"
              type="text"
              placeholder="Tên sản phẩm"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="categories">Danh mục</label>
            <select
              className="form-control"
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              required
            >
              <option value="">-----</option>
              {dataDM.category.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-6 mb-3">
            <label htmlFor="image">Ảnh sản phẩm</label>
            <input
              className="form-control"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="img-fluid"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-12 mb-3">
            <label htmlFor="description">Mô tả sản phẩm</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Mô tả sản phẩm"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
<div className="m-5 d-flex justify-content-end">
<button
          className="btn btn-danger btn-block "
          type="submit"
        >
          <h5>Thêm mới sản phẩm</h5>
        </button>
</div>
      </form>
    </div>
  );
};

export default AddForm;
