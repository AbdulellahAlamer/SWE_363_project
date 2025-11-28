// Edit a club
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!club)
      return res.status(404).json({ status: "error", message: "Club not found" });

    res.json({ status: "success", data: club });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};