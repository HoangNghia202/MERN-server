import express from "express";
import {
  getUser,
  getUserFriend,
  addRemoveFriend,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMw.js";
const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriend);

//UDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
