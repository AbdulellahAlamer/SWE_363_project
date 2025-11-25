const User = require('../../models/user.js');

// User registration controller
module.exports = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    
    // Validate request
    if (!username || !password || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        errors: {
          required: ['username', 'password', 'email']
        }
      });
    }

    // Basic validation
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Username must be at least 3 characters long'
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address'
      });
    }
    
    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      throw new Error('User with this username already exists');
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const result = await User.create({
      username: username.trim(),
      password,
      email: email.toLowerCase().trim()
    });
    
    // Return success
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: result._id,
          username: result.username,
          email: result.email,
          role: result.role,
          status: result.status,
          createdAt: result.createdAt
        }
      }
    });
  } catch (error) {
    // Check for duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 'error',
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Handle custom error messages
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        status: 'error',
        message: error.message
      });
    }
    
    next(error);
  }
};
