// Get a specific club
import Club from "../../models/Club.js"; // Import your Club model

export default async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate(
      "president members events posts"
    );
    if (!club)
      return res.status(404).json({ status: "error", message: "Club not found" });

    res.json({ status: "success", data: club });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
