import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/Style.css"; // Đảm bảo có file CSS để quản lý style nếu cần

const UserForm = () => {
  const { id } = useParams(); // Lấy ID người dùng từ URL
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    address: "",
    phone: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false); // Biến để kiểm tra có đang ở chế độ chỉnh sửa hay không

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken"); // Lấy Bearer token từ localStorage
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(`/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserInfo(data); // Cập nhật thông tin người dùng
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Gọi hàm lấy dữ liệu người dùng
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value })); // Cập nhật thông tin người dùng khi thay đổi
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated User Info:", userInfo);
    // Gửi thông tin cập nhật tới server nếu cần
    setIsEditing(false); // Đóng chế độ chỉnh sửa
  };

  return (
    <div className="container">
      <h2 className="teude">User Profile</h2>
      <div className="profileBox">
        {!isEditing ? (
          <div className="infoContainer">
            <table className="table">
              <caption className="caption">User Information</caption>
              <tbody>
                <tr>
                  <td className="label">Username:</td>
                  <td>{userInfo.username}</td>
                </tr>
                <tr>
                  <td className="label">Email:</td>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <td className="label">Full Name:</td>
                  <td>{userInfo.fullName}</td>
                </tr>
              </tbody>
            </table>

            <table className="table">
              <caption className="caption">Contact Details</caption>
              <tbody>
                <tr>
                  <td className="label">Address:</td>
                  <td>{userInfo.address}</td>
                </tr>
                <tr>
                  <td className="label">Phone:</td>
                  <td>{userInfo.phone}</td>
                </tr>
                <tr>
                  <td className="label">Role:</td>
                  <td>{userInfo.role}</td>
                </tr>
              </tbody>
            </table>

            <button onClick={() => setIsEditing(true)} className="editButton">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="editContainer">
              <table className="table">
                <caption className="caption">Edit User Information</caption>
                <tbody>
                  <tr>
                    <td className="label">Username:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="text"
                        name="username"
                        defaultValue={userInfo.username}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">Email:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="email"
                        name="email"
                        defaultValue={userInfo.email}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">Full Name:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="text"
                        name="fullName"
                        defaultValue={userInfo.fullName}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="table">
                <caption className="caption">Edit Contact Details</caption>
                <tbody>
                  <tr>
                    <td className="label">Address:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="text"
                        name="address"
                        defaultValue={userInfo.address}
                        onChange={handleChange}
                        className="input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">Phone:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="tel"
                        name="phone"
                        defaultValue={userInfo.phone}
                        onChange={handleChange}
                        className="input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">Role:</td>
                    <td>
                      <input
                        placeholder="username"
                        type="text"
                        name="role"
                        defaultValue={userInfo.role}
                        onChange={handleChange}
                        className="input"
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttonContainer">
              <button type="submit" className="saveButton">
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cancelButton"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserForm;
