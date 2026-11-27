import sequelize from "../config/database.js";

import Aluno from "./Aluno.js";
import Materia from "./Materia.js";
import Registro from "./Registro.js";
import Reflexao from "./Reflexao.js";


Materia.hasMany(Registro, {
  as: "registros",
  foreignKey: {
    name: "materiaId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

Registro.belongsTo(Materia, {
  as: "materia",
  foreignKey: "materiaId",
});

export { sequelize, Aluno, Materia, Registro, Reflexao };
