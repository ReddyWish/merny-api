const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshToken: [String],
  avatar: {
    type: String,
    default: "1672146784_new_preview_mzl.xiwwwimc.png",
  },
  profession: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);

// const userSchema = new Schema({
//     username: {
//       type: String,
//       required: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     roles: {
//       User: {
//         type: Number,
//         default: 2001
//       },
//       Editor: Number,
//       Admin: Number
//     },
//     refreshToken: [String]
//   },
//   { timestamps: true }
// )
//
// module.exports = mongoose.model("User", userSchema)