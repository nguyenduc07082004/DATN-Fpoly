import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ins from "../../api";

const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") ?? "{}");
  const [user, setUser] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address:""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData?._id) {
      setUser({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        address:userData.address
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUser({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      address:userData.address
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const res = await ins.put(`/users/${userData._id}`, user);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thông tin đã được cập nhật.",
        });
        setIsEditing(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Cập nhật thông tin thất bại.",
      });
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Thông tin người dùng</h1>
      <div className="row align-items-center">
        <div className="text-center mb-4 col-md-4">
          <img
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid"
            alt="Profile"
            className="rounded-circle img-fluid"
            style={{ maxWidth: "150px" }}
          />
        </div>
        <div className="col-md-8">
          <div className="mb-3 row">
            <label className="col-form-label col-sm-3">Họ:</label>
            <div className="col-sm-9">
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={user.first_name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control-plaintext">{user.first_name}</p>
              )}
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-form-label col-sm-3">Tên:</label>
            <div className="col-sm-9">
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={user.last_name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control-plaintext">{user.last_name}</p>
              )}
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-form-label col-sm-3">Email:</label>
            <div className="col-sm-9">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  disabled
                  value={user.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control-plaintext">{user.email}</p>
              )}
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-form-label col-sm-3">Số điện thoại:</label>
            <div className="col-sm-9">
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control-plaintext">{user.phone}</p>
              )}
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-form-label col-sm-3">Địa chỉ:</label>
            <div className="col-sm-9">
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control-plaintext">{user?.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        {isEditing ? (
          <>
            <button
              className="btn btn-success me-2"
              onClick={handleSaveChanges}
            >
              Lưu thay đổi
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Hủy
            </button>
          </>
        ) : (
          <button className="btn btn-warning" onClick={handleEditClick}>
            Sửa thông tin
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
