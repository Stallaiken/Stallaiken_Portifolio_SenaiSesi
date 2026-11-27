const API_URL = import.meta.env.VITE_API_URL || "/api";

// Origem do servidor (usada para montar o endereço das imagens enviadas).
const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

export function urlImagem(caminho) {
  if (!caminho) return null;
  if (caminho.startsWith("http")) return caminho;
  return `${API_ORIGIN}${caminho}`;
}

async function requisicao(endpoint, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${endpoint}`, opcoes);
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. O back-end está rodando?",
    );
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao comunicar com o servidor.");
  }

  return dados;
}

function json(method, dados) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  };
}

export const api = {
  // Aluno
  listarAlunos: () => requisicao("/alunos"),
  criarAluno: (dados) => requisicao("/alunos", json("POST", dados)),
  atualizarAluno: (id, dados) => requisicao(`/alunos/${id}`, json("PUT", dados)),

  // Matérias
  listarMaterias: (instituicao = "") =>
    requisicao(`/materias${instituicao ? `?instituicao=${instituicao}` : ""}`),
  criarMateria: (dados) => requisicao("/materias", json("POST", dados)),
  excluirMateria: (id) => requisicao(`/materias/${id}`, { method: "DELETE" }),

  // Registros (envio com FormData por causa da imagem)
  listarRegistros: () => requisicao("/registros"),
  criarRegistro: (formData) =>
    requisicao("/registros", { method: "POST", body: formData }),
  atualizarRegistro: (id, formData) =>
    requisicao(`/registros/${id}`, { method: "PUT", body: formData }),
  excluirRegistro: (id) => requisicao(`/registros/${id}`, { method: "DELETE" }),

  // Reflexões
  listarReflexoes: () => requisicao("/reflexoes"),
  criarReflexao: (dados) => requisicao("/reflexoes", json("POST", dados)),
  atualizarReflexao: (id, dados) =>
    requisicao(`/reflexoes/${id}`, json("PUT", dados)),
};
