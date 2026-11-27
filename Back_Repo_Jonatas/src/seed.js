// Popula o banco com os dados de src/seed/dados.js.
//   npm run seed         -> só cria se o banco estiver vazio
//   npm run seed:reset   -> APAGA TUDO e recria
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import migrar from "./config/migrar.js";
import { mimePorExtensao } from "./utils/imagens.js";
import { sequelize, Aluno, Materia, Registro, Reflexao, Imagem } from "./models/index.js";
import dados from "./seed/dados.js";

const pastaSeed = path.dirname(fileURLToPath(import.meta.url)) + "/seed";
const resetar = process.argv.includes("--reset");

if (resetar) {
  console.log("Apagando todas as tabelas...");
  await sequelize.sync({ force: true });
} else {
  await sequelize.sync();
  await migrar();

  if ((await Materia.count()) > 0) {
    console.log("O banco já tem dados. Nada foi alterado. (Use npm run seed:reset para recriar.)");
    process.exit(0);
  }
}

await Aluno.create(dados.aluno);
await Reflexao.create(dados.reflexoes);

const materias = {};

for (const materia of dados.materias) {
  materias[`${materia.instituicao}:${materia.nome}`] = await Materia.create(materia);
}

for (const item of dados.registros) {
  const { materia: nomeMateria, instituicao, imagens = [], ...campos } = item;
  const materia = materias[`${instituicao}:${nomeMateria}`];

  if (!materia) {
    console.log(`Registro "${campos.titulo}" ignorado: matéria "${nomeMateria}" (${instituicao}) não existe.`);
    continue;
  }

  // Cada arquivo de imagem vira uma linha na tabela "imagens".
  const caminhos = [];

  for (const arquivo of imagens) {
    try {
      const registroImagem = await Imagem.create({
        mime: mimePorExtensao(arquivo),
        dados: await fs.readFile(path.join(pastaSeed, arquivo)),
      });

      caminhos.push(`/api/imagens/${registroImagem.id}`);
    } catch {
      console.log(`Imagem não encontrada: ${arquivo}`);
    }
  }

  await Registro.create({
    ...campos,
    materiaId: materia.id,
    imagens: JSON.stringify(caminhos),
  });
}

console.log("Pronto! Dados criados. Edite tudo depois pelo painel /admin.");
process.exit(0);
