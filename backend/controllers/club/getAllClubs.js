import Club from "../../models/Club.js";
import "../../models/Event.js";
import "../../models/Post.js";
import "../../models/user.js";

export default async (req, res) => {
  try {
    const clubs = await Club.find().populate("president members events posts");
    res.json({ status: "success", data: clubs });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
