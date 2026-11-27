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
        isIn: [["conteudo", "participacao", "projeto", "atividade"]],
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
    // ----- Campos do SENAI -----
    projetos_desenvolvidos: { type: DataTypes.TEXT, allowNull: true },
    codigos_produzidos: { type: DataTypes.TEXT, allowNull: true },
    videos: { type: DataTypes.TEXT, allowNull: true }, // links, um por linha
    relatorios_tecnicos: { type: DataTypes.TEXT, allowNull: true },
    aprendizagens_construidas: { type: DataTypes.TEXT, allowNull: true },
    competencias_desenvolvidas: { type: DataTypes.TEXT, allowNull: true },
    // Lista de imagens (JSON). O campo antigo "imagem" continua sendo lido.
    imagens: { type: DataTypes.TEXT, allowNull: true },
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
