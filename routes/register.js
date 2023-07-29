const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
// const validationRules = require("../config/validationRules")

router.post("/", registerController.handleNewUser);

module.exports = router;