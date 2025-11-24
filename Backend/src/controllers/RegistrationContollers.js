// src/controllers/RegistrationContollers.js
const bcrypt = require('bcryptjs');
const User = require('../database/models/users');
const { RegisterSchema } = require('../validations/index');

const Registration = async (req, res) => {
  try {
    // validate
    const { error, value } = RegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = value;

    // check exist
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // create
    const user = new User({
      username,
      email,
      password: hashed
    });

    await user.save();

    // respond (omit password)
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { Registration };
