import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Reflexao = sequelize.define(
  "Reflexao",
  {
    reflexao_pessoal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aprendizado_academico: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aplicacao_pratica: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    melhorias: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resiliencia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    conexoes_interdisciplinares: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aprendizados_para_vida: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "reflexoes",
  },
);

export default Reflexao;
