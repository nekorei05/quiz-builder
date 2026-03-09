const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*
Middleware to protect routes
Checks if token exists and is valid
*/
exports.protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();

    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};



//Role-based authorization

exports.authorize = (...roles) => {
  const allowed = roles.map(r => String(r).toLowerCase());
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const userRole = String(req.user.role || '').toLowerCase();
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};
``