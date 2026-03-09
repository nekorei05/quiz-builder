const User = require('../models/User');
const jwt = require('jsonwebtoken');

//   generate JWT 
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role           
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/*
Register new user
 route:  POST /api/auth/register
*/
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //if user exits
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user in MongoDB
    const user = await User.create({
      name,
      email,
      password,
      role 
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user),
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
Login  user
 route:  POST /api/auth/login
*/
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // validate credentials
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user), 
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