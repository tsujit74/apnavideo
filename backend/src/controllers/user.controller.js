import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";

import { Meeting } from "../models/meeting.model.js";

import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Required field" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not FOund" });
    }

    let isPasswordRight = await bcrypt.compare(password, user.password);

    if (isPasswordRight) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or Password" });
    }
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const register = async (req, res) => {
  const { name, username,email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    const existingUserEmail = await User.findOne({email});
    if (existingUser || existingUserEmail) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "user already exists" });
    }

    if (password.length < 6) {
      return res
        .status(httpStatus.LENGTH_REQUIRED)
        .json({ message: "Passwod should be 6 Letter" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User registerd" });
  } catch (err) {
    res.json({ message: `Something went wrong ${err}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Some thing went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });
    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Added Code to History" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export { login, register, getUserHistory, addToHistory };
