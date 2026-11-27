export const TIPOS = {
  conteudo: "Conteúdo",
  participacao: "Participação",
  projeto: "Projeto",
};

// Reflexões anuais (lista plana, usada no painel admin).
export const REFLEXOES = [
  ["reflexao_pessoal", "Expectativas e objetivos pessoais"],
  ["aprendizado_academico", "Aprendizado acadêmico"],
  ["aplicacao_pratica", "Aplicação prática"],
  ["melhorias", "O que desejo melhorar"],
  ["resiliencia", "Resiliência e solução de problemas"],
  ["conexoes_interdisciplinares", "Conexões interdisciplinares"],
  ["aprendizados_para_vida", "Aprendizados da escola para a vida"],
];

// As mesmas reflexões, agrupadas para a página "Quem sou eu?".
export const GRUPOS_REFLEXAO = [
  {
    titulo: "Trajetória",
    campos: [
      ["reflexao_pessoal", "Expectativas e objetivos pessoais"],
      ["melhorias", "O que desejo melhorar"],
    ],
  },
  {
    titulo: "Aprendizado",
    campos: [
      ["aprendizado_academico", "Aprendizado acadêmico"],
      ["aplicacao_pratica", "Aplicação prática"],
      ["conexoes_interdisciplinares", "Conexões interdisciplinares"],
    ],
  },
  {
    titulo: "Crescimento",
    campos: [
      ["resiliencia", "Resiliência e solução de problemas"],
      ["aprendizados_para_vida", "Aprendizados da escola para a vida"],
    ],
  },
];

// Tópicos de um registro do SESI, de acordo com o tipo.
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

// Tópicos de uma atividade do SENAI, na ordem de exibição.
// "registros_fotograficos" e "videos" têm tratamento especial.
export const TOPICOS_SENAI = [
  ["projetos_desenvolvidos", "Projetos desenvolvidos"],
  ["codigos_produzidos", "Códigos produzidos"],
  ["registros_fotograficos", "Registros fotográficos"],
  ["videos", "Vídeos"],
  ["relatorios_tecnicos", "Relatórios técnicos"],
  ["aprendizagens_construidas", "Aprendizagens construídas"],
  ["competencias_desenvolvidas", "Competências desenvolvidas"],
  ["autoavaliacao", "Autoavaliação"],
];
