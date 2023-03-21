import Post from "../models/PostModel.js";
import PostModel from "../models/PostModel.js";
import UserModel from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await UserModel.findById(userId);
    console.log("user", user);
    const newPost = new PostModel({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      Comments: [],
    });
    await newPost.save();
    const post = await PostModel.find().sort({ createdAt: -1 });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    //find by order of date

    const post = await PostModel.find().sort({ createdAt: -1 });
    console.log("post>>>>", post);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = PostModel.findById({ userId });
    res.status(200).json(posts);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await PostModel.findById(id);
    const isLiked = await post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true); // it will set {_id1233: true}
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
