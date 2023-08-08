const User = require("../model/User")
const Post = require("../model/Post")
const asyncHandler = require("express-async-handler")
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt")

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "..", "uploads", "avatars"))
// },
// filename: (req, file, cb) => {
//     const fileName = Date.now().toString() + path.extname(file.originalname)
//   cb(null, fileName)
// }
// })
//
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true)
//   } else {
//     cb(new Error("Only image files are allowed"), false)
//   }
// }
//
// const upload = multer({ storage, fileFilter })


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

const updateUser = async (req, res) => {
  const { id, username, profession, password, email } = req.body;
  console.log(password)
  console.log(typeof password)
  console.log(password === "undefined")

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // if (typeof password !== "undefined") {
    //   const hashedPwd = await bcrypt.hash(password, 10);
    //   user.password = hashedPwd
    // }
    password !== "undefined" && (user.password = await bcrypt.hash(password, 10));

    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      const fileName = Date.now().toString() + avatarFile.name;
      await avatarFile.mv(path.join(__dirname, "..", "uploads", "avatars", fileName));
      user.avatar = fileName;
    }

    if (username) user.username = username;
    if (profession) user.profession = profession;
    if (email) user.email = email;

    await user.save();

    const sanitizedUser = {
      _id: user._id,
      avatar: req.file ? req.file.filename : user.avatar,
      name: user.name,
      profession: user.profession,
      email: user.email,
      roles: user.roles,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.json({ message: "User updated successfully", user: sanitizedUser })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
  getUser
}