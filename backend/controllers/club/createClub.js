// Create a club
export const createClub = async (req, res) => {
  try {
    const club = await club.create(req.body);
    res.status(201).json({ status: "success", data: club });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
