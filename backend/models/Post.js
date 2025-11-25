const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },

    imageURL: {
      type: String,
      default: "",
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    tag: {
      type: String,

      default: "",
    },
    likes: [
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
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
module.exports = Post;
