import mongoose from "mongoose";
const PostSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },

    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },

    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    Comment: {
      type: Array,
      default: [],
    },
  },
  { timeStamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
