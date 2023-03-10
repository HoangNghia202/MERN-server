import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers("Authorization");
    if (!token) {
      res.status(401).json("You are not authenticated");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};
