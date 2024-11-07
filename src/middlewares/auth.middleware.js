const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in JWT verification:", error);
    return res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = verifyJWT;
