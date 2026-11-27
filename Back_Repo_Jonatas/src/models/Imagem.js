import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// As imagens ficam DENTRO do banco SQLite. Assim, basta levar o arquivo
// database/portfolio.sqlite junto com o projeto e as imagens continuam aparecendo.
const Imagem = sequelize.define(
  "Imagem",
  {
    mime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dados: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    tableName: "imagens",
  },
);

export default Imagem;
