import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";

const getUsers = async (req, res) => {
  if (!req.isAdmin) { 
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied' });
  }
  try {
    const users = await User.find({}, 'name username email');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Something went wrong' });
  }
};



const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(200).json({ message: "User deleted successfully" });
  }
};

const editUser = async (req, res) => {
  try {
    const { name, username, email } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, email },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Error updating user' });
  }
};

export { getUsers, deleteUser,editUser };
