const protectRoute = require("./protectRoute");

// Auth guard for any logged-in user (role agnostic)
module.exports = async (req, res, next) => {
  await protectRoute(req, res, (err) => {
    if (err) return next(err);

    next();
  });
};
