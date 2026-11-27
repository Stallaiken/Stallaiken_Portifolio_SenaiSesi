import { Aluno } from "../models/index.js";
import criarCrud from "./crudController.js";

const alunoController = criarCrud(
  Aluno,
  ["nome", "serie", "itinerario", "turma"],
  { unico: true },
);

export default alunoController;
