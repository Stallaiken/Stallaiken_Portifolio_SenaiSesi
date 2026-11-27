// =====================================================================
//  MODELO DE DADOS DO PORTFÓLIO  (seed template)
//
//  1) Edite este arquivo com as SUAS informações.
//  2) Rode:  npm run seed          -> só cria se o banco estiver vazio
//            npm run seed:reset    -> APAGA TUDO e recria com este arquivo
//
//  Dica: tudo isso também pode ser feito depois pelo painel /admin.
// =====================================================================

export default {
  // ---------- Dados do aluno (página "Quem sou eu?") ----------
  aluno: {
    nome: "Seu nome completo",
    serie: "Ex.: 2º ano do Ensino Médio",
    turma: "Ex.: 2B",
    itinerario: "Ex.: Informática para internet",
  },

  // ---------- Matérias (viram as abas das páginas SESI e SENAI) ----------
  // instituicao: "SESI" ou "SENAI"
  materias: [
    { nome: "Matemática", instituicao: "SESI" },
    { nome: "Português", instituicao: "SESI" },
    { nome: "Lógica de Programação", instituicao: "SENAI" },
  ],

  // ---------- Registros ----------
  // "materia" deve ter o mesmo nome e instituição de uma matéria acima.
  // "imagens" (opcional): caminhos de arquivos, relativos à pasta src/seed/
  //   Ex.: imagens: ["imagens/foto1.png"]  (coloque o arquivo em src/seed/imagens/)
  registros: [
    // ----- SESI: tipo "conteudo" (precisa de bimestre 1 a 4) -----
    {
      materia: "Matemática",
      instituicao: "SESI",
      tipo: "conteudo",
      bimestre: 1,
      titulo: "Título do conteúdo",
      resumo_teorico: "Resumo teórico do conteúdo estudado.",
      imagens: [],
    },

    // ----- SESI: tipo "participacao" -----
    {
      materia: "Português",
      instituicao: "SESI",
      tipo: "participacao",
      bimestre: 2,
      titulo: "Título da participação",
      reflexao_pratica: "Reflexão prática.",
      chamou_atencao: "O que chamou atenção.",
      exemplo_aprendizado: "Exemplo ou atividade.",
      aplicacao_cotidiano: "Aplicação no cotidiano.",
      autoavaliacao: "Autoavaliação.",
    },

    // ----- SESI: tipo "projeto" -----
    {
      materia: "Matemática",
      instituicao: "SESI",
      tipo: "projeto",
      bimestre: 3,
      titulo: "Título do projeto",
      descricao: "Descrição do projeto.",
    },

    // ----- SENAI: atividade (sem bimestre) -----
    {
      materia: "Lógica de Programação",
      instituicao: "SENAI",
      tipo: "atividade",
      titulo: "Título da atividade",
      projetos_desenvolvidos: "Projetos desenvolvidos.",
      codigos_produzidos: "function ola() {\n  console.log('Olá!');\n}",
      videos: "https://exemplo.com/video1\nhttps://exemplo.com/video2", // um link por linha
      relatorios_tecnicos: "Relatórios técnicos.",
      aprendizagens_construidas: "Aprendizagens construídas.",
      competencias_desenvolvidas: "Competências desenvolvidas.",
      autoavaliacao: "Autoavaliação.",
      imagens: [], // registros fotográficos
    },
  ],

  // ---------- Reflexões anuais (página "Quem sou eu?") ----------
  reflexoes: {
    reflexao_pessoal: "Expectativas e objetivos pessoais.",
    melhorias: "O que desejo melhorar.",
    aprendizado_academico: "Aprendizado acadêmico.",
    aplicacao_pratica: "Aplicação prática.",
    conexoes_interdisciplinares: "Conexões interdisciplinares.",
    resiliencia: "Resiliência e solução de problemas.",
    aprendizados_para_vida: "Aprendizados da escola para a vida.",
  },
};
