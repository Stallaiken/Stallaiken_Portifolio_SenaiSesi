import { Registro, Materia } from "../models/index.js";

import criarCrud from "./crudController.js";

async function validarRegistro(dados) {
  if (!dados.titulo?.trim()) {
    throw new Error("O título é obrigatório.");
  }

  const tipos = ["conteudo", "participacao", "projeto"];

  if (!tipos.includes(dados.tipo)) {
    throw new Error("Tipo de registro inválido.");
  }

  const materia = await Materia.findByPk(dados.materiaId);

  if (!materia) {
    throw new Error("Matéria não encontrada.");
  }

  // Valida os campos de acordo com o tipo.
  if (dados.tipo === "conteudo" && !dados.resumo_teorico?.trim()) {
    throw new Error("O resumo teórico é obrigatório.");
  }

  if (dados.tipo === "participacao") {
    const campos = [
      "reflexao_pratica",
      "chamou_atencao",
      "exemplo_aprendizado",
      "aplicacao_cotidiano",
      "autoavaliacao",
    ];

    for (const campo of campos) {
      if (!dados[campo]?.trim()) {
        throw new Error(`O campo ${campo} é obrigatório.`);
      }
    }
  }

  if (dados.tipo === "projeto" && !dados.descricao?.trim()) {
    throw new Error("A descrição do projeto é obrigatória.");
  }

  // Valida o bimestre de acordo com a instituição.
  if (materia.instituicao === "SESI") {
    const bimestre = Number(dados.bimestre);

    if (!Number.isInteger(bimestre) || bimestre < 1 || bimestre > 4) {
      throw new Error("O SESI exige um bimestre entre 1 e 4.");
    }

    dados.bimestre = bimestre;
  } else if (materia.instituicao === "SENAI") {
    if (
      dados.bimestre !== null &&
      dados.bimestre !== undefined &&
      dados.bimestre !== ""
    ) {
      throw new Error("O SENAI não utiliza bimestres.");
    }

    dados.bimestre = null;
  }
}

const registroController = criarCrud(
  Registro,
  [
    "titulo",
    "tipo",
    "descricao",
    "resumo_teorico",
    "reflexao_pratica",
    "chamou_atencao",
    "exemplo_aprendizado",
    "aplicacao_cotidiano",
    "autoavaliacao",
    "imagem",
    "bimestre",
    "materiaId",
  ],
  {
    filtros: ["materiaId", "tipo", "bimestre"],
    include: [{ model: Materia }],
    validar: validarRegistro,
  },
);

export default registroController;
