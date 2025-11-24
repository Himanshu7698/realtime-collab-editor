// src/controllers/LoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/users');
const { LoginSchema } = require('../validations/index');

const Login = async (req, res) => {
  try {
    const { error, value } = LoginSchema.validate(req.body);
    
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const payload = { id: user._id, email: user.email, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    // prefer to not send password
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ message: 'Login successful', token, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { Login };
