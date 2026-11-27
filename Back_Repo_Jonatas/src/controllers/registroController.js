import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Registro, Materia } from "../models/index.js";

import criarCrud from "./crudController.js";

const pastaUploads = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);

// Campos do formato SENAI (autoavaliacao é compartilhado com o SESI).
const CAMPOS_SENAI = [
  "projetos_desenvolvidos",
  "codigos_produzidos",
  "videos",
  "relatorios_tecnicos",
  "aprendizagens_construidas",
  "competencias_desenvolvidas",
  "autoavaliacao",
];

// Campos do formato antigo, que o front reinterpreta como os do SENAI.
const CAMPOS_LEGADOS = [
  "descricao",
  "resumo_teorico",
  "reflexao_pratica",
  "chamou_atencao",
  "exemplo_aprendizado",
  "aplicacao_cotidiano",
];

// Imagens do registro: lista nova (JSON) + campo antigo "imagem".
function listaImagens(registro) {
  let lista = [];

  try {
    lista = JSON.parse(registro.imagens || "[]");
  } catch {
    lista = [];
  }

  if (registro.imagem && !lista.includes(registro.imagem)) {
    lista.unshift(registro.imagem);
  }

  return lista;
}

async function validarRegistro(dados) {
  if (!dados.titulo?.trim()) {
    throw new Error("O título é obrigatório.");
  }

  const materia = await Materia.findByPk(dados.materiaId);

  if (!materia) {
    throw new Error("Matéria não encontrada.");
  }

  // SENAI: um registro é uma "atividade" com tópicos próprios.
  if (materia.instituicao === "SENAI") {
    const preenchidos = CAMPOS_SENAI.some((campo) => dados[campo]?.trim());

    if (!preenchidos) {
      throw new Error("Preencha pelo menos um tópico da atividade.");
    }

    dados.tipo = "atividade";
    dados.bimestre = null;

    // Os campos do formato antigo já foram reaproveitados nos novos.
    for (const campo of CAMPOS_LEGADOS) {
      dados[campo] = null;
    }

    return;
  }

  const tipos = ["conteudo", "participacao", "projeto"];

  if (!tipos.includes(dados.tipo)) {
    throw new Error("Tipo de registro inválido.");
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
    "imagens",
    "projetos_desenvolvidos",
    "codigos_produzidos",
    "videos",
    "relatorios_tecnicos",
    "aprendizagens_construidas",
    "competencias_desenvolvidas",
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

// Apaga o arquivo da imagem (se existir) quando o registro é excluído.
async function excluir(req, res) {
  try {
    const registro = await Registro.findByPk(req.params.id);

    if (registro) {
      for (const caminho of listaImagens(registro)) {
        const arquivo = path.join(pastaUploads, path.basename(caminho));
        await fs.unlink(arquivo).catch(() => {});
      }
    }
  } catch {
    // Se falhar, segue para a exclusão normal.
  }

  return crudRegistro.excluir(req, res);
}

// Monta a lista de imagens a partir das que foram mantidas
// (campo "imagens_existentes") + as novas enviadas (campo "imagens").
export function prepararImagens(req, res, next) {
  const novas = (req.files || []).map((arq) => `/uploads/${arq.filename}`);
  const enviouLista = req.body.imagens_existentes !== undefined;

  if (novas.length === 0 && !enviouLista) {
    return next();
  }

  let mantidas = [];

  try {
    mantidas = JSON.parse(req.body.imagens_existentes || "[]");
  } catch {
    mantidas = [];
  }

  req.body.imagens = JSON.stringify([...mantidas, ...novas]);
  req.body.imagem = null; // o campo antigo passa a ser coberto pela lista

  return next();
}

const registroController = { ...crudRegistro, excluir };

export default registroController;
