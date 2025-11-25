import protectRoute from "./protectRoute.js";

// Auth guard for users with role "President"
const protectPresident = async (req, res, next) => {
  await protectRoute(req, res, (err) => {
    if (err) return next(err);

    const user = req.user; // ensure user is available locally

    if (user?.role !== "president") {
      return res
        .status(403)
        .json({ status: "error", message: "President role required" });
    }

    next();
  });
};

export default protectPresident;
