// const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler")
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
  if (!username || !password ) {
    return res.status(400).json({ message: 'All fields are required' })
  }
    //check for duplicate
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.sendStatus(409);

    //encrypting pwd
      const hashedPwd = await bcrypt.hash(password, 10);
      //store the new user
    const result = await User.create({
      username,
      "password": hashedPwd
    });

  if (result) { //created
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
})

module.exports = { handleNewUser }