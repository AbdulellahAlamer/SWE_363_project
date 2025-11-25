const User = require('../../models/user.js');

// Change password controller
module.exports = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate request
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        errors: {
          required: ['currentPassword', 'newPassword', 'confirmPassword']
        }
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'New passwords do not match'
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'New password must be at least 6 characters long'
      });
    }

    // Change password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Verify current password
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    return res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
