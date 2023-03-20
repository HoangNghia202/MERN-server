import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExist = await User.findOne({ email });
    console.log("userExist", userExist);

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100),
      impression: Math.floor(Math.random() * 100),
    });
    const saveUser = await newUser.save();
    return res.status(201).json(saveUser);
  } catch (error) {
    console.error("error>>>", error.message);
    return res.status(500).json(error);
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return res
      .status(200)
      .json({ ...user, token, message: "Login successful" });
  } catch (error) {
    console.error("error>>>", error.message);
    return res.status(500).json(error);
  }
};
