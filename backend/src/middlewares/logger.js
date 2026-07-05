const pool = require("../config/database");

function logger(action, table) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      const userId = req.user?.iduti || req.user?.id || null;
      if (userId) {
        pool
          .execute(
            `INSERT INTO logs (utilisateur_id, action, table_concernee) VALUES (?, ?, ?)`,
            [userId, action, table],
          )
          .catch((err) => console.error("Erreur log:", err.message));
      }

      return originalJson(data);
    };

    next();
  };
}

module.exports = logger;
