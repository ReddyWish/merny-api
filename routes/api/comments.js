const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/commentsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles")

router.route("/:id")
  .post(verifyRoles(ROLES_LIST.User), commentsController.createNewComment)
  .get(verifyRoles(ROLES_LIST.User), commentsController.getComments)
router.route("/")
  .patch(verifyRoles(ROLES_LIST.User), commentsController.updateComment)
  .delete(verifyRoles(ROLES_LIST.User), commentsController.deleteComment)
  // .get(verifyRoles(ROLES_LIST.User), commentsController.getAllPosts)

  // .patch(verifyRoles(ROLES_LIST.User), commentsController.updateComment)///
// .delete(verifyRoles(ROLES_LIST.User), postsController.deletePost)

// router.route("/:id")
//   .delete(verifyRoles(ROLES_LIST.User), commentsController.deleteComment)///
//
// router.route("/:id")



module.exports = router;