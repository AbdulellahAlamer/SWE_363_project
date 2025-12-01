import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "awaiting-president", "inactive"],
      default: "active",
    },

    logo: {
      type: String, // URL or path to logo
      default: "",
    },
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create and export the model
const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);
export default Club;
