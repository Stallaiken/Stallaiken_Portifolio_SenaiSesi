import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Materia = sequelize.define(
  "Materia",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instituicao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["SESI", "SENAI"]],
      },
    },
  },
  {
    tableName: "materias",
  },
);

export default Materia;
