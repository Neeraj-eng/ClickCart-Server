import bcrypt from "bcrypt";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔹 SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let hashpassword;

    try {
      hashpassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        message: "Error while hashing password",
      });
    }

    let user = await User.create({
      name,
      email,
      password: hashpassword,
      role,
    });

    user = user.toObject();
    user.password = undefined;

    return res.status(200).json({
      message: "User registered successfully",
      user,
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

// 🔹 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Enter correct details",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const payload = {
      role: user.role,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, // 🔥 production me true karna (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        name: user.name,
      },
    });

  } catch (err) {
    console.log("login error");
    res.status(400).json({
      message: err.message,
    });
  }
};

// 🔹 LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        message: "Token missing",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (err) {
    console.log("logout err");
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};