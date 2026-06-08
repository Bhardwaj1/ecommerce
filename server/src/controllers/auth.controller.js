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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    return res.status(404).json({
      success: false,
      error: "User not exists",
    });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  let formattedUserData = {
    _id: userExists?._id,
    name: userExists?.name,
    email: userExists?.email,
    role: userExists?.role,
  };

  res.status(200).json({
    success: true,
    message: "Login successfull",
    user: formattedUserData,
  });
});

module.exports = { registerUser, loginUser };
