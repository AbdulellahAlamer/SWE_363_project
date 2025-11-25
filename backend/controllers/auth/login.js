const User = require('../../models/user.js');
const { generateToken } = require('../../utils/jwt');

// User login controller
module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        errors: {
          required: ['email', 'password']
        }
      });
    }
    
    // Find user by email (includes password field)
    const user = await User.findByEmail(email);
    
    // User not found
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Account is not active. Please contact support.'
      });
    }
    
    // Compare passwords using the schema method
    const passwordMatch = await user.comparePassword(password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Remove password from user object before returning
    const userObject = user.toObject();
    delete userObject.password;
    
    // Set cookie if in development (optional)
    if (process.env.NODE_ENV === 'development') {
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
    
    // Return token and user info
    return res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userObject._id,
          username: userObject.username,
          email: userObject.email,
          role: userObject.role,
          status: userObject.status,
          lastLogin: userObject.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
