import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import { useParams } from "react-router-dom";
import { baseURL } from "../../api";
const EditForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    categories: "", 
    description: "",
  });

  const { dataDM } = useContext(CategoryContext); 
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { id } = useParams(); // Get the product ID from the URL

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/products/${id}`);
        const product = response.data;
        setFormData({
          title: product.title,
          categories: product.categories._id,
          description: product.description,
        });
        setImagePreview(`${baseURL}/images/${product.image}`);
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    };
    fetchProductData();
  }, [id]);

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: e.target.value,
    }));
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.categories) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    // Prepare FormData to send
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("categories", formData.categories);
    formDataToSend.append("description", formData.description);

    // Append image if selected
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      await axios.put(
        `http://localhost:8000/products/edit/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Sản phẩm đã được cập nhật thành công!");
      window.location.href = "/admin/qlsp"; // Redirect to product list
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  return (
    <div>
      <h2 className="m-3">Cập nhật sản phẩm</h2>
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
              {dataDM.category.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="m-5 row">
          <div className="col-md-12 mb-3">
            <label htmlFor="description">Mô tả sản phẩm</label>
            <textarea
              className="form-control"
              cols={100}
              rows={3}
              placeholder="Mô tả sản phẩm"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

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
              <div className="image-preview" style={{ marginTop: "10px" }}>
                <img
                  src={imagePreview || ""} 
                  alt="Image"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="m-5">
          <button
            className="btn btn-primary"
            style={{ width: "500px", height: "50px" }}
            type="submit"
          >
            <h5>Cập nhật sản phẩm</h5>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
