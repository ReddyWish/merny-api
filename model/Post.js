const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imgUrl: {
      type: String,
      default: ""
    },
    views: {
      type: Number,
      default: 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  },
  {
    timestamps: true
  })


module.exports = mongoose.model("Post", postSchema)


// const postSchema = new Schema({
//     title: {
//       type: String,
//       required: true
//     },
//     content: {
//       type: String,
//       required: true
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       // required: true
//     }
//   },
//   {
//     timestamps: true
//   })