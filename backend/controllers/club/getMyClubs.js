// Get clubs the user joined

export const getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ members: req.user._id });
    res.json({ status: "success", data: clubs });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
