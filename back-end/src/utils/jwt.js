const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const { JWT_SECRET } = process.env;

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

module.exports = { verifyToken, generateToken };
