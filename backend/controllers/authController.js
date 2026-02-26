const User = require('../models/User');
const jwt = require('jsonwebtoken');

/*
Function to generate JWT
*/
const generateToken = (id) => {
  return jwt.sign(
    { id },                     // payload
    process.env.JWT_SECRET,     // secret key
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/*
@desc   Register new user
@route  POST /api/auth/register
*/
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password will auto-hash because of pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
     res.status(201).json({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
@desc   Login user
@route  POST /api/auth/login
*/
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {

    res.json({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};