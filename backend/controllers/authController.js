const User = require('../models/User');
const jwt = require('jsonwebtoken');

/*
 Function to generate JWT 
 Now includes BOTH id and role
*/
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role            // ✅ IMPORTANT: Include role in token
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/*
 @desc Register new user
 @route POST /api/auth/register
*/
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user in MongoDB
    const user = await User.create({
      name,
      email,
      password,
      role // MongoDB will store the correct role
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user), // ✅ Includes role now
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
 @desc Login user
 @route POST /api/auth/login
*/
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Validate credentials
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user), // ✅ Includes role now
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