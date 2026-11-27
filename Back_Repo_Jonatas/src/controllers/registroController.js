import fs from "node:fs/promises";
import path from "node:path";

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

const crudRegistro = criarCrud(
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
    include: [{ model: Materia, as: "materia" }],
    order: [["createdAt", "DESC"]],
    validar: validarRegistro,
  },
);


async function excluir(req, res) {
  try {
    const registro = await Registro.findByPk(req.params.id);

    if (registro?.imagem) {
      const arquivo = path.resolve("uploads", path.basename(registro.imagem));
      await fs.unlink(arquivo).catch(() => {});
    }
  } catch {
    // Se falhar, segue para a exclusão normal.
  }

  return crudRegistro.excluir(req, res);
}

const registroController = { ...crudRegistro, excluir };

export default registroController;
