const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Matiere = sequelize.define("Matiere", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  intitule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filiere: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  niveau: {
    type: DataTypes.ENUM("L1", "L2", "L3", "M1", "M2"),
    allowNull: false,
  },
  volume_horaireprevu: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Matiere;
