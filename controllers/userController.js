import { request } from "express";
import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log("get current user>>>", user);

    return res.status(200).json(user);
  } catch (error) {
    console.error(err.message);
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return { _id, firstName, lastName, location, occupation, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    console.log(error.message);
    res.status();
    res.status(404).json({ message: error.message });
  }
};

// Update
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    console.log("user in add remove>>>>", user);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return { _id, firstName, lastName, location, occupation, picturePath };
      }
    );
    console.log("formattedFriends", formattedFriends);

    res.status(200).json(formattedFriends);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};
