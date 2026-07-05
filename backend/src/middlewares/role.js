module.exports = (...roles) => {
  return (req, res, next) => {
    const roleMap = { admin: 1, rh: 2, enseignant: 3 };
    const allowedIds = roles.map((r) => roleMap[r]);

    if (!allowedIds.includes(parseInt(req.user.role_id))) {
      return res
        .status(403)
        .json({ message: "Accès refusé : permission insuffisante" });
    }
    next();
  };
};
