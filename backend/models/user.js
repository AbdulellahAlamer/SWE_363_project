import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["student", "admin", "president"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "Deleted"],
      default: "active",
    },
    name: {
      type: String,
    },

    major: {
      type: String,
    },
    Join_Year: {
      type: String,
    },
    photo_URL: {
      type: String,
    },
    Certificates: [
      {
        title: { type: String },
        description: { type: String },
        URL: { type: String },
      },
    ],

    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordChangedAt if this is not a new document
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is created after password change
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });

// Create and export the model
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
