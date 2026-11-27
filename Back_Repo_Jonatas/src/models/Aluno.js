import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Aluno = sequelize.define(
  "Aluno",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itinerario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    turma: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "alunos",
  },
);

export default Aluno;
