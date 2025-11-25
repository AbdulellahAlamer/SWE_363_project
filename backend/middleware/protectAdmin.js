const protectRoute = require("./protectRoute");

// Auth guard for users with role "admin"
module.exports = async (req, res, next) => {
  await protectRoute(req, res, (err) => {
    if (err) return next(err);

    const user = req.user; // ensure user is available locally

    if (user?.role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", message: "Admin role required" });
    }

    next();
  });
};
