const validate = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action." });
  }
};

module.exports = { validate };
