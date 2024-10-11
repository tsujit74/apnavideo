import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/AdminPage.css";
import withAuth from "../utils/withAuth";
import BackButton from "./BackButton";

const AdminPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://apnavideobackend.onrender.com/api/v1/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        enqueueSnackbar(
          `Error fetching users: ${
            error.response?.data?.message || "Something went wrong"
          }`,
          {
            variant: "error",
          }
        );
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://apnavideobackend.onrender.com/api/v1/admin/deleteUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(users.filter((user) => user._id !== userId));
        enqueueSnackbar("User deleted successfully", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(
          `Error deleting user: ${
            error.response?.data?.message || "Something went wrong"
          }`,
          {
            variant: "error",
          }
        );
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://apnavideobackend.onrender.com/api/v1/admin/editUser/${editingUser}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === editingUser ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null);
      enqueueSnackbar("User updated successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        `Error updating user: ${
          error.response?.data?.message || "Something went wrong"
        }`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleCloseModal = () => setEditingUser(null);

  return (
    <div className="admin">
      <BackButton/>
      <h1 className="admin-heading">Admin Dashboard</h1>

      <h3>User Management</h3>

      <div style={{ float: "right", padding: "10px" }}>
        Total Users: {users.length}
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  variant="contained"
                  onClick={() => handleEditUser(user)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDeleteUser(user._id)}
                  color="error"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="model-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <br />
              <Button variant="contained" type="submit">
                Update User
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(AdminPage,true);
