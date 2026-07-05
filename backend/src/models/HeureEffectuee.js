const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HeureEffectuee = sequelize.define("HeureEffectuee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date_cours: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  type_heure: {
    type: DataTypes.ENUM("CM", "TD", "TP"),
    allowNull: false,
  },
  duree: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  est_complementaire: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  statut: {
    type: DataTypes.ENUM("en attente", "validé", "refusé"),
    defaultValue: "en attente",
  },
});

module.exports = HeureEffectuee;
