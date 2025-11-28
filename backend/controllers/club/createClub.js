// Create a club
import Club from "../../models/Club.js"; // Import your Club model

export default  async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json({ status: "success", data: club });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
