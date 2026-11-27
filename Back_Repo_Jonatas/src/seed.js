// Popula o banco com dados de EXEMPLO para você ver o site funcionando.
// Uso: npm run seed   (só roda se o banco estiver vazio)
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

import migrar from "./config/migrar.js";
import { sequelize, Aluno, Materia, Registro, Reflexao } from "./models/index.js";

await fs.mkdir(path.resolve("database"), { recursive: true });
await sequelize.sync();
await migrar();

if ((await Materia.count()) > 0) {
  console.log("O banco já tem dados. Nada foi alterado.");
  process.exit(0);
}

await Aluno.create({
  nome: "Jonatas Stallaiken Costa Lima Pereira",
  serie: "Ensino Médio",
  itinerario: "Itinerário formativo",
  turma: "—",
});

const matematica = await Materia.create({ nome: "Matemática", instituicao: "SESI" });
const historia = await Materia.create({ nome: "História", instituicao: "SESI" });
const logica = await Materia.create({ nome: "Lógica de Programação", instituicao: "SENAI" });

await Registro.bulkCreate([
  {
    titulo: "Funções do 1º grau (exemplo)",
    tipo: "conteudo",
    resumo_teorico:
      "Texto de exemplo: uma função do 1º grau tem a forma f(x) = ax + b. O gráfico é uma reta e o coeficiente 'a' define se ela cresce ou decresce.",
    bimestre: 1,
    materiaId: matematica.id,
  },
  {
    titulo: "Debate sobre a Revolução Industrial (exemplo)",
    tipo: "participacao",
    reflexao_pratica: "Texto de exemplo: o debate mostrou como a tecnologia muda a sociedade.",
    chamou_atencao: "Texto de exemplo: a rapidez com que as fábricas transformaram as cidades.",
    exemplo_aprendizado: "Texto de exemplo: atividade em grupo comparando antes e depois da industrialização.",
    aplicacao_cotidiano: "Texto de exemplo: relacionar automação de hoje com os debates daquela época.",
    autoavaliacao: "Texto de exemplo: participei bastante, mas posso melhorar minha argumentação.",
    bimestre: 2,
    materiaId: historia.id,
  },
  {
    titulo: "Calculadora em JavaScript (exemplo)",
    tipo: "atividade",
    projetos_desenvolvidos: "Texto de exemplo: calculadora feita com HTML, CSS e JavaScript.",
    codigos_produzidos: "function somar(a, b) {\n  return a + b;\n}",
    relatorios_tecnicos: "Texto de exemplo: relatório com as etapas, testes e resultados.",
    aprendizagens_construidas: "Texto de exemplo: funções, condicionais e eventos do DOM.",
    competencias_desenvolvidas: "Texto de exemplo: lógica, organização e resolução de problemas.",
    autoavaliacao: "Texto de exemplo: entreguei no prazo e quero melhorar os testes.",
    materiaId: logica.id,
  },
]);

await Reflexao.create({
  reflexao_pessoal: "Texto de exemplo: minhas expectativas e objetivos para este ano.",
  aprendizado_academico: "Texto de exemplo: o que aprendi nas disciplinas.",
  aplicacao_pratica: "Texto de exemplo: como apliquei o que aprendi.",
  melhorias: "Texto de exemplo: o que desejo melhorar.",
  resiliencia: "Texto de exemplo: desafios e como resolvi problemas.",
  conexoes_interdisciplinares: "Texto de exemplo: conexões entre SESI e SENAI.",
  aprendizados_para_vida: "Texto de exemplo: o que levo da escola para a vida.",
});

console.log("Dados de exemplo criados! Edite tudo pelo painel /admin.");
process.exit(0);
