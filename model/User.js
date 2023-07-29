const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    // posts: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Post"
    // },
    roles: {
      User: {
        type: Number,
        default: 2001
      },
      Editor: Number,
      Admin: Number
    },
    refreshToken: [String]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)