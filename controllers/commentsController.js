const Post = require("../model/Post")
const Comment = require("../model/Comment");
const asyncHandler = require("express-async-handler")


const createNewComment =async (req, res) => {
  if (!req?.body.comment || !req?.params?.id) return res.status(400).json({ "message": "text and id are required" });
  const { comment } = req.body;
  const author = req.body.user
  if (!comment) return res.json({ message: 'comment can not be empty' })
  console.log(comment, req.params.id)

  const newComment = await Comment.create({ comment, author })
  console.log(newComment)
  await newComment.save()

  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: newComment._id }
    })
  } catch (err) {
    console.error(err)
  }
  res.json(newComment)
}

const getComments = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      const commentsList = await Promise.all(
        post.comments.map((comment) => {
          return Comment.findById(comment)
        }),
      )
      res.json(commentsList)
    } catch (err) {
      res.json({ message: "Smth wrong on the server, try to load comments later" })
    }
}

const updateComment = async (req, res) => {
  const { id, comment } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { comment },
      { new: true } // This option returns the updated comment in the response
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.json(updatedComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

const deleteComment = async (req, res) => {
  const { id } = req.body
  console.log(req.body)
  try {
    const deletedComment = await Comment.findByIdAndRemove(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.json({ id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  createNewComment,
  getComments,
  deleteComment,
  updateComment
}