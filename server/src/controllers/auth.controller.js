const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      success: false,
      error: "Email already registered",
    });
  }

  let hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log({ hashedPassword });

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();

  res.status(201).json({
    success: true,
    user,
    message: "User registered successfully",
  });
});

module.exports = { registerUser };
