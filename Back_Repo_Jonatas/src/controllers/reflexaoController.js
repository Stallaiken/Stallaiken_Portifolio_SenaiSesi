import { Reflexao } from "../models/index.js";
import criarCrud from "./crudController.js";

const reflexaoController = criarCrud(
  Reflexao,
  [
    "reflexao_pessoal",
    "aprendizado_academico",
    "aplicacao_pratica",
    "melhorias",
    "resiliencia",
    "conexoes_interdisciplinares",
    "aprendizados_para_vida",
  ],
  { unico: true },
);

export default reflexaoController;
