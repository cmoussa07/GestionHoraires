const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enseignant = sequelize.define("Enseignant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.ENUM(
      "Assistant",
      "Maître-Assistant",
      "Professeur",
      "Autres",
    ),
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM("Permanent", "Vacataire"),
    allowNull: false,
  },
  departement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taux_horaire: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Enseignant;
