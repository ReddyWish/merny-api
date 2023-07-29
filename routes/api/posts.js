const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/postsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles")

router.route("/")
  .get(verifyRoles(ROLES_LIST.User), postsController.getAllPosts)
  .post(verifyRoles(ROLES_LIST.User), postsController.createNewPost)
  .patch(verifyRoles(ROLES_LIST.User), postsController.updatePost)
  // .delete(verifyRoles(ROLES_LIST.User), postsController.deletePost)

router.route("/:id")
  .delete(verifyRoles(ROLES_LIST.User), postsController.deletePost)


module.exports = router;