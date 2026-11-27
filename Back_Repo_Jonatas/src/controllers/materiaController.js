import { Materia } from "../models/index.js";
import criarCrud from "./crudController.js";

async function validarMateria(dados) {
  if (!dados.nome || !dados.nome.trim()) {
    throw new Error("O nome da matéria é obrigatório.");
  }

  dados.instituicao = dados.instituicao?.trim().toUpperCase();

  if (!["SESI", "SENAI"].includes(dados.instituicao)) {
    throw new Error("A instituição deve ser SESI ou SENAI.");
  }
}

const materiaController = criarCrud(Materia, ["nome", "instituicao"], {
  filtros: ["instituicao"],
  order: [["nome", "ASC"]],
  validar: validarMateria,
});

export default materiaController;
