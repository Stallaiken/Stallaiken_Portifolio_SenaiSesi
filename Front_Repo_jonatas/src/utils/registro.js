// Funções para "ler" um registro, inclusive os salvos na versão anterior do banco.

// Campos do formato antigo reaproveitados nos tópicos do SENAI.
// Assim os registros SENAI já salvos continuam aparecendo, sem migrar o banco.
const LEGADO_SENAI = {
  projetos_desenvolvidos: ["descricao", "exemplo_aprendizado"],
  aprendizagens_construidas: ["resumo_teorico", "reflexao_pratica"],
  competencias_desenvolvidas: ["chamou_atencao", "aplicacao_cotidiano"],
};

const CAMPOS_SENAI = [
  "projetos_desenvolvidos",
  "codigos_produzidos",
  "videos",
  "relatorios_tecnicos",
  "aprendizagens_construidas",
  "competencias_desenvolvidas",
  "autoavaliacao",
];

// Devolve os textos do SENAI de um registro (novo ou antigo).
export function camposSenai(registro) {
  const resultado = {};

  for (const campo of CAMPOS_SENAI) {
    let valor = registro[campo] || "";

    if (!valor.trim() && LEGADO_SENAI[campo]) {
      valor = LEGADO_SENAI[campo]
        .map((legado) => registro[legado])
        .filter((texto) => texto && texto.trim())
        .join("\n\n");
    }

    resultado[campo] = valor;
  }

  return resultado;
}

// Lista de imagens: campo novo (JSON) + campo antigo "imagem".
export function listaImagens(registro) {
  let lista = [];

  try {
    const lido = JSON.parse(registro.imagens || "[]");
    lista = Array.isArray(lido) ? lido : [];
  } catch {
    lista = [];
  }

  if (registro.imagem && !lista.includes(registro.imagem)) {
    lista.unshift(registro.imagem);
  }

  return lista;
}

// Links de vídeo: um por linha.
export function listaVideos(texto) {
  return (texto || "")
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);
}
