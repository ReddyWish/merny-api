const Post = require("../model/Post")
const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const path = require("path");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().lean();
  if (!posts?.length) {
    return res.status(400).json({ "message": "No posts found." })
  }
  ;
  //add username to each post before sending the response

  const postsWithUser = await Promise.all(posts.map(async (post) => {
    const user = await User.findById(post.user).lean().exec()
    return { ...post, username: user?.username }
  }))

  res.json(postsWithUser)
})

const createNewPost = asyncHandler(async (req, res) => {
  // if (!req?.body.title || !req?.body?.content) return res.status(400).json({ "message": "Title and Content are required" });
  const { user, title, content } = req.body;
  console.log(req.files)

  if (req.files) {
    let fileName = Date.now().toString() + req.files.image.name
    fileName = fileName.replace(/\s+/g, '');
    await req.files.image.mv(path.join(__dirname, "..", "uploads", fileName))

    // Check if a post with the same title already exists
    const duplicate = await Post.findOne({ title }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate post title" });
    }

    // Create the new post
    const post = await Post.create({ user, title, content, imgUrl: fileName });

    if (post) {
      // Send the updated post data in the response
      res.json(post);
    } else {
      return res.status(400).json({ message: "Invalid post data received" });
    }
  } else {
    const duplicate = await Post.findOne({ title }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate post title" });
    }
    // Create the new post
    const post = await Post.create({ user, title, content });

    if (post) {
      // Send the updated post data in the response
      res.json(post);
    } else {
      return res.status(400).json({ message: "Invalid post data received" });
    }
  }
})

const updatePost = asyncHandler(async (req, res) => {
  const { id, user, title, content, image } = req.body
  if (!id || !user || !title || !content) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const post = await Post.findById(id).exec()
  if (!post) {
    return res.status(400).json({ message: "Post not found" })
  }
  console.log(req.files)
  console.log(image)
  if (req.files) {
    let fileName = Date.now().toString() + req.files.image.name
    fileName = fileName.replace(/\s+/g, '');
    await req.files.image.mv(path.join(__dirname, "..", "uploads", fileName))
    // const __dirname = dirname(fileURLToPath(import.meta.url))
    // req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
    post.id = id
    post.user = user
    post.title = title
    post.content = content
    post.imgUrl = fileName

    await post.save()
    console.log(post)

    res.json(post)
  } else if (image) {
    post.id = id
    post.user = user
    post.title = title
    post.content = content

    await post.save()
    res.json(post)
  } else {
    post.id = id
    post.user = user
    post.title = title
    post.content = content
    post.imgUrl = ''

    await post.save()
    console.log(post)

    res.json(post)
  }
})


const deletePost = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const post = await Post.findByIdAndDelete(id)
    if (!post) return res.json({ message: "there are no such posts" })
    res.json({ id })
  } catch (err) {
    console.error(err)
  }
})

const getPost = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ "message": "ID parameter is required " })
  }
  const post = await Post.findOne({ _id: req.params.id }).exec();
  if (!post) {
    return res.status(400).json({ "message": `Post ID ${req.body.id} not found` });
  }
  res.json(post);
}

module.exports = {
  getAllPosts,
  createNewPost,
  updatePost,
  getPost,
  deletePost
}