const protectRoute = require("./protectRoute");

// Auth guard for users with role "President"
module.exports = async (req, res, next) => {
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
