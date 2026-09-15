import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticate = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.split(" ")[1];

    console.log("token", token);

    if (!token) {
      console.log("token is missing", req.cookies);
      return res.status(400).json({
        message: "token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({
      message: `hii ${err.message}`,
    });
  }
};