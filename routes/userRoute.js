import express from "express";
import {
  getUser,
  getUserFriend,
  addRemoveFriend,
  createRemoveFriendRequest,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMw.js";
const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriend);

//UDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// CREATE
router.post(
  "/createRemoveRequest/:id/:friendId",
  verifyToken,
  createRemoveFriendRequest
);

export default router;
