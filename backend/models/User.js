const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true   // No duplicate emails allowed
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['admin', 'student'], 
      default: 'student'
    }
  },
  { timestamps: true }
);

/*
PRE-SAVE MIDDLEWARE

This runs automatically before a user is saved.
We hash the password here so we NEVER store plain text passwords.
*/
userSchema.pre('save', async function (next) {

  // Only hash password if it was modified
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  // Hash password
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/*
Custom method to compare passwords during login
*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);