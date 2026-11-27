// Funções simples para trabalhar com a lista de imagens de um registro.

// Lê um texto JSON e sempre devolve uma lista (nunca dá erro).
export function lerLista(texto) {
  try {
    const lista = JSON.parse(texto || "[]");
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// Imagens do registro: lista nova + campo antigo "imagem".
export function listaImagens(registro) {
  const lista = lerLista(registro.imagens);

  if (registro.imagem && !lista.includes(registro.imagem)) {
    lista.unshift(registro.imagem);
  }

  return lista;
}

const TIPOS = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function mimePorExtensao(nomeArquivo) {
  const ponto = nomeArquivo.lastIndexOf(".");
  const extensao = ponto >= 0 ? nomeArquivo.slice(ponto).toLowerCase() : "";

  return TIPOS[extensao] || "application/octet-stream";
}
