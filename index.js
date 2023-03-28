import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import AuthRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoutes.js";
import { createPost } from "./controllers/postsController.js";
import { fileURLToPath } from "url";

//  CONFIGURATION

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
import User from "./models/User.js";
import Post from "./models/PostModel.js";
import { users, posts } from "./data/index.js";

import { register } from "./controllers/authController.js";
import { verifyToken } from "./middleware/authMw.js";
//  FILE STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// ROUTE WITH FILE
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//ROUTES
app.use("/auth", AuthRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
// MONGO SETUP
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.error(error.message, "\nDid not connect"));
