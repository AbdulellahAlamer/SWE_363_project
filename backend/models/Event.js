const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Workshop",
        "Hackathon",
        "Seminar",
        "Competition",
        "Meetup",
        "Other",
      ],
      default: "Other",
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    imageURL: {
      type: String,
      default: "",
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create and export the model
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
module.exports = Event;
