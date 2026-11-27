import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Registro = sequelize.define(
  "Registro",
  {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["conteudo", "participacao", "projeto"]],
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resumo_teorico: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reflexao_pratica: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chamou_atencao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    exemplo_aprendizado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aplicacao_cotidiano: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    autoavaliacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bimestre: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "registros",
  },
);

export default Registro;
