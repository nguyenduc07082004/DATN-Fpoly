import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const FromUser = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    address: "",
    phone: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User Info:", userInfo);
    // Here you'd typically send a request to update the user data
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Profile</h2>
      <div style={styles.profileBox}>
        {!isEditing ? (
          // Display user info in tables
          <div style={styles.infoContainer}>
            <table style={styles.table}>
              <caption style={styles.caption}>User Information</caption>
              <tbody>
                <tr>
                  <td style={styles.label}>Username:</td>
                  <td>{userInfo.username}</td>
                </tr>
                <tr>
                  <td style={styles.label}>Email:</td>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <td style={styles.label}>Full Name:</td>
                  <td>{userInfo.fullName}</td>
                </tr>
              </tbody>
            </table>

            <table style={styles.table}>
              <caption style={styles.caption}>Contact Details</caption>
              <tbody>
                <tr>
                  <td style={styles.label}>Address:</td>
                  <td>{userInfo.address}</td>
                </tr>
                <tr>
                  <td style={styles.label}>Phone:</td>
                  <td>{userInfo.phone}</td>
                </tr>
                <tr>
                  <td style={styles.label}>Role:</td>
                  <td>{userInfo.role}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsEditing(true)}
              style={styles.editButton}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Editing form
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.editContainer}>
              <table style={styles.table}>
                <caption style={styles.caption}>Edit User Information</caption>
                <tbody>
                  <tr>
                    <td style={styles.label}>Username:</td>
                    <td>
                      <input
                        type="text"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Email:</td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Full Name:</td>
                    <td>
                      <input
                        type="text"
                        name="fullName"
                        value={userInfo.fullName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table style={styles.table}>
                <caption style={styles.caption}>Edit Contact Details</caption>
                <tbody>
                  <tr>
                    <td style={styles.label}>Address:</td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Phone:</td>
                    <td>
                      <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Role:</td>
                    <td>
                      <input
                        type="text"
                        name="role"
                        value={userInfo.role}
                        onChange={handleChange}
                        style={styles.input}
                        disabled // assuming the role shouldn't be changed
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={styles.buttonContainer}>
              <button type="submit" style={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={styles.cancelButton}
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

const styles = {
  container: {
    maxWidth: "800px", // Increased width
    margin: "20px auto",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "2em",
    marginBottom: "20px",
    color: "#333",
  },
  profileBox: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
  },
  editContainer: {
    display: "flex",
    flexDirection: "column",
  },
  table: {
    width: "100%", // Full width for tables
    borderCollapse: "collapse",
    border: "1px solid #ddd",
    marginBottom: "20px",
  },
  caption: {
    fontSize: "1.2em",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    padding: "12px 8px",
    borderBottom: "1px solid #ddd",
  },
  input: {
    padding: "10px",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1em",
    marginTop: "8px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  editButton: {
    padding: "10px 15px",
    width: "100%",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  saveButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "48%",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "48%",
  },
};

export default FromUser;
