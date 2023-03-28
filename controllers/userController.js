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
// export const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;
//     console.log("id, friendId", id, friendId);

//     const user = await User.findById(id);
//     console.log("user friends>>>>", user.friends);
//     const friend = await User.findById(friendId);
//     console.log("friend friends>>>>", friend.friends);
//     console.log("user in add remove>>>>", user, friend);
//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((thisId) => thisId !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, location, occupation, picturePath }) => {
//         return { _id, firstName, lastName, location, occupation, picturePath };
//       }
//     );
//     console.log("formattedFriends", formattedFriends);

//     res.status(200).json(formattedFriends);
//   } catch (error) {
//     console.log("err add remove>>>", error.message);
//     res.status(404).json({ message: error.message });
//   }
// };

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

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
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.log("err add remove>>>", err.message);

    res.status(404).json({ message: err.message });
  }
};

export const createRemoveFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friendRequests.includes(friendId)) {
      user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
      friend.friendRequests = friend.friendRequests.filter((id) => id !== id);
    } else {
      user.friendRequests.push(friendId);
      friend.friendRequests.push(id);
    }
    await user.save();
    await friend.save();
    const friendRequests = await Promise.all(
      user.friendRequests.map((id) => User.findById(id))
    );
    const formattedFriendRequests = friendRequests.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriendRequests);
  } catch (error) {
    console.log("err create remove request>>>", error.message);
    res.status(404).json({ message: error.message });
  }
};
