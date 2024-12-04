import "../.././App.scss";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../api/contexts/UserContext";
import ins from "../../api";
import { baseURL } from "../../api";
const QLTK = () => {
  const {
    handleNextPage,
    handlePrevPage,
    handleSearch,
    currentPage,
    totalPages,
    searchQuery,
  } = useContext(UserContext);

  const [users, setUsers] = useState<User[]>([]); 

  const getUser = async () => {
    try {
      const response = await ins.get(`${baseURL}/users`);
      setUsers(response.data); 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleToggleActive = async (userId: string, newStatus: boolean) => {
    try {
      const response = await ins.post(`${baseURL}/users/block`, {
        userId,
        is_blocked: newStatus,
      });
  
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, is_blocked: newStatus } : user
          )
        );
        console.log(response.data.message || "Status updated successfully!");
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error: any) {
      console.error(
        "Failed to update status:",
        error.response?.data?.message || error.message
      );
    }
  };
  
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý tài khoản</b>
      </p>
      <div className="mx-5 py-4 d-flex">
        <div className="search">
          Search
          <input
            className="rounded"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-2">Tên tài khoản</th>
            <th className="col-2">Email</th>
            <th className="col-1">Trạng thái</th>
            <th className="col-1">SĐT</th>
            <th className="col-3">Địa chỉ</th>
            <th className="col-2">Trạng thái người dùng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {users.length > 0 &&
            users.map((u, index) => (
              <tr className="d-flex" key={u._id}>
                <td className="col-1">{index + 1}</td>
                <td className="col-2">{u.first_name} {u.last_name}</td>
                <td className="col-2">{u.email}</td>
                <td className="col-1">{u.is_active ? "Online" : "Offline"}</td>
                <td className="col-1">{u.phone}</td>
                <td className="col-3">{u.address}</td>
                <td className="col-2">
                  <button
                    className={`rounded ${u.is_blocked ? "action-del" : "action-success"}`}
                    onClick={() => handleToggleActive(u._id, !u.is_blocked)}
                  >
                    {u.is_blocked ? "Đang khoá" : "Đang mở"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="my-4 d-flex justify-content-center align-items-center">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          className="mx-2 btn btn-primary"
        >
          Trang trước
        </button>
        <p className="m-0 mx-2">
          Trang {currentPage} / {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="mx-2 btn btn-primary"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default QLTK;
