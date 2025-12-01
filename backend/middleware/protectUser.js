import protectRoute from "./protectRoute.js";

// Auth guard for any logged-in user (role agnostic)
const protectUser = async (req, res, next) => {
  await protectRoute(req, res, (err) => {
    if (err) return next(err);

    next();
  });
};

export default protectUser;
