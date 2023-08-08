const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController")
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
// const verifyJWT = require("../middleware/verifyJWT")

// router.use(verifyJWT)

router.route("/")
  .get(verifyRoles(ROLES_LIST.User), usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser)
  .patch(verifyRoles(ROLES_LIST.User), usersController.updateUser)
  // .post(usersController.createNewUser)


router.route("/:id")
  .get(verifyRoles(ROLES_LIST.User), usersController.getUser);

module.exports = router