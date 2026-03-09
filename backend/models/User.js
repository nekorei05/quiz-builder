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
      unique: true  
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
hashing the passwords
*/
userSchema.pre('save', async function () {

  // If password not modified, skip hashing
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


//Custom method to compare passwords during login

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);