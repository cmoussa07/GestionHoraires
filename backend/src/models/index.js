const sequelize = require("../config/database");
const User = require("./User");
const Enseignant = require("./Enseignant");
const Matiere = require("./Matiere");
const HeureEffectuee = require("./HeureEffectuee");

// Associations
Enseignant.hasMany(HeureEffectuee, { foreignKey: "enseignant_id" });
HeureEffectuee.belongsTo(Enseignant, { foreignKey: "enseignant_id" });

Matiere.hasMany(HeureEffectuee, { foreignKey: "matiere_id" });
HeureEffectuee.belongsTo(Matiere, { foreignKey: "matiere_id" });

User.belongsTo(Enseignant, { foreignKey: "enseignant_id" });
Enseignant.hasOne(User, { foreignKey: "enseignant_id" });

module.exports = { sequelize, User, Enseignant, Matiere, HeureEffectuee };
