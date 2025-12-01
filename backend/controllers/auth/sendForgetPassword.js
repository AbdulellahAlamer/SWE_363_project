import process from "process";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/sendingEmail.js";
import resetPasswordEmailTemplate from "../../utils/resetPasswordEmailTemplate.js";

// Handles "forgot password": receives email, sends a reset link to changePassword page
const sendForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No account found for that email",
      });
    }

    const resetPage = process.env.RESET_PASSWROD_PAGE;
    if (!resetPage) {
      return res.status(500).json({
        status: "error",
        message: "Reset password page URL is not configured",
      });
    }

    const resetUrl = `${resetPage}?userID=${user._id}`;
    const html = resetPasswordEmailTemplate({
      name: user.name,
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
      text: `Reset your password using this link: ${resetUrl}`,
    });

    return res.json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};

export default sendForgetPassword;
