const User = require("../model/User")
const Post = require("../model/Post")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")


const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ "message": "No users found" })
  }
  res.json(users);
})

const deleteAllUserPosts = async (userId) => {
  try {
    // Find all posts that belong to the user
    const userPosts = await Post.find({ user: userId }).exec();
    if (userPosts.length > 0) {
      // Delete all posts of the user
      await Post.deleteMany({ user: userId });
    }
  } catch (error) {
    throw new Error("Error while deleting user posts");
  }
};

const deleteUser = asyncHandler(async (req, res) => {
  console.log(req.body)
  if (!req?.body?.id) return res.status(400).json({ "message": "User ID required" });
  try {
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
      return res.status(204).json({ "message": `User ID ${req.body.id} not found` });
    }
    await deleteAllUserPosts(req.body.id)
    const result = await User.deleteOne({ _id: req.body.id });
    res.json({ id: req.body.id, result })
  } catch (err) {
    console.error(err)
  }
})

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ "message": "User ID required" });

  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
      return res.status(204).json({ "message": `User ID ${req.params.id} not found` });
    }

    // Find all posts that belong to the user
    const userPosts = await Post.find({ user: req.params.id }).exec();

    res.json({ user, posts: userPosts });
  } catch (error) {
    res.status(500).json({ "message": "Error while fetching user and posts data" });
  }
}

module.exports = {
  getAllUsers,
  deleteUser,
  getUser
}