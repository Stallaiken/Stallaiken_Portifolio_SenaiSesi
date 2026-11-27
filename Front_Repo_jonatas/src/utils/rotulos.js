export const TIPOS = {
  conteudo: "Conteúdo",
  participacao: "Participação",
  projeto: "Projeto",
};

export const REFLEXOES = [
  ["reflexao_pessoal", "Expectativas e objetivos pessoais"],
  ["aprendizado_academico", "Aprendizado acadêmico"],
  ["aplicacao_pratica", "Aplicação prática"],
  ["melhorias", "O que desejo melhorar"],
  ["resiliencia", "Resiliência e solução de problemas"],
  ["conexoes_interdisciplinares", "Conexões interdisciplinares"],
  ["aprendizados_para_vida", "Aprendizados da escola para a vida"],
];

// Campos exibidos na página de detalhe, de acordo com o tipo do registro.
export const SECOES_POR_TIPO = {
  conteudo: [["resumo_teorico", "Resumo teórico"]],
  projeto: [["descricao", "Sobre o projeto"]],
  participacao: [
    ["reflexao_pratica", "Reflexão prática"],
    ["chamou_atencao", "O que chamou atenção"],
    ["exemplo_aprendizado", "Exemplo ou atividade"],
    ["aplicacao_cotidiano", "Aplicação no cotidiano"],
    ["autoavaliacao", "Autoavaliação"],
  ],
};

export function resumoDoRegistro(registro, limite = 140) {
  const texto =
    registro.resumo_teorico ||
    registro.descricao ||
    registro.reflexao_pratica ||
    "";

  return texto.length > limite ? `${texto.slice(0, limite).trim()}…` : texto;
}
