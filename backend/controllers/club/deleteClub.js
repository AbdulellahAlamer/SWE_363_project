// Delete a club
export const deleteClub = async (req, res) => {
  try {
    const club = await club.findByIdAndDelete(req.params.id);
    if (!club)
      return res.status(404).json({ status: "error", message: "Club not found" });

    res.json({ status: "success", message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};