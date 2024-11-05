import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../api/contexts/CategoryContext";
import ins from "../../api";
import { useParams } from "react-router-dom";

const EditForm = () => {
  const storage1 = [
    { _id: "1", options: "128GB" },
    { _id: "2", options: "256GB" },
    { _id: "3", options: "512GB" },
    { _id: "4", options: "1TB" },
  ];
  const color1 = [
    { _id: "1", options: "Đen" },
    { _id: "2", options: "Trắng" },
    { _id: "3", options: "Hồng" },
    { _id: "4", options: "Xanh" },
  ];
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [categories, setCategories] = useState("Điện thoại");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const { dataDM } = useContext(CategoryContext);
  const { id } = useParams();
  const [data, setData] = useState({
    title: "",
    price: "",
    storage: "128GB",
    categories: "Điện thoại",
    quantity: "",
    colors: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.options[event.target.selectedIndex].text);

    console.log(event.target.options[event.target.selectedIndex].text);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await ins.get(`/products/${id}`);
      setData(response.data);
    };
    fetchData();
  }, []);

  const Suckmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (image) {
      formData.append("image", image);
    }
    formData.append("categories", categories);
    formData.append("storage", storage);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("color", color);
    formData.append("description", description);
    console.log(title, image, categories);

    // console.log();
    const response = await axios.put(
      `http://localhost:8000/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    window.location.href = "/admin/qlsp";
  };
  return (
    <div>
      <p className="m-3">
        <h2>Thêm mới sản phẩm</h2>
      </p>
      <form onSubmit={Suckmit}>
        <div className="m-5 d-flex">
          <div className="form-group">
            <label htmlFor="title">Tên sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "500px", height: "50px" }}
              type="text"
              placeholder="Tên sản phẩm"
              onChange={(e) => setTitle(e.target.value)}
              required
              defaultValue={data?.title}
            />
          </div>
          <div className="form-group category">
            <label htmlFor="categories">Danh mục</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              onChange={(e) => {
                setCategories(e.target.value);
                handleCategoryChange(e);
              }}
            >
              <option value="0">-----</option>
              {dataDM.category.map((i) => (
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
              onChange={(e) => setStorage(e.target.value)}
              name="storage"
            >
              {selectedCategory === "Phụ kiện" &&
                storage1.map((i) => (
                  <option disabled value={i.options}>
                    {i.options}
                  </option>
                ))}
              {selectedCategory === "Điện thoại" &&
                storage1.map((i) => (
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
              onChange={(e) => setPrice(e.target.value)}
              name="price"
              required
              defaultValue={data?.price}
            />
          </div>
          <div className="form-group quantity">
            <label htmlFor="price">Số lượng</label>
            <input
              className="form-control"
              type="number"
              placeholder="Số lượng sản phẩm"
              style={{ width: "200px", height: "50px" }}
              onChange={(e) => setQuantity(e.target.value)}
              name="quantity"
              required
              defaultValue={data.quantity}
            />
          </div>

          <div className="form-group category">
            <label htmlFor="image">Ảnh sản phẩm</label>
            <input
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="form-group category">
            <label htmlFor="specialFeature">Màu</label>
            <select
              className="form-control"
              style={{ width: "200px", height: "50px" }}
              onChange={(e) => setColor(e.target.value)}
              name="color"
            >
              {selectedCategory === "Phụ kiện" &&
                color1.map((i) => (
                  <option disabled value={i.options}>
                    {i.options}
                  </option>
                ))}
              {selectedCategory === "Điện thoại" &&
                color1.map((i) => (
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
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              defaultValue={data?.description}
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
            <h5>Thêm mới sản phẩm</h5>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
