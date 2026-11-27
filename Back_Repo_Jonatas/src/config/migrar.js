import { DataTypes } from "sequelize";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sequelize from "./database.js";
import { Registro, Imagem } from "../models/index.js";
import { listaImagens, mimePorExtensao } from "../utils/imagens.js";

// Colunas adicionadas depois da primeira versão do banco.
const colunasNovas = {
  projetos_desenvolvidos: DataTypes.TEXT,
  codigos_produzidos: DataTypes.TEXT,
  videos: DataTypes.TEXT,
  relatorios_tecnicos: DataTypes.TEXT,
  aprendizagens_construidas: DataTypes.TEXT,
  competencias_desenvolvidas: DataTypes.TEXT,
  imagens: DataTypes.TEXT,
};

// Atualiza um banco antigo SEM apagar nada: só cria as colunas que faltam.
export default async function migrar() {
  const consulta = sequelize.getQueryInterface();
  const existentes = await consulta.describeTable("registros");

  for (const [nome, tipo] of Object.entries(colunasNovas)) {
    if (!existentes[nome]) {
      await consulta.addColumn("registros", nome, { type: tipo, allowNull: true });
      console.log(`Coluna adicionada em registros: ${nome}`);
    }
  }
}

const pastaUploads = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);

// Imagens salvas na versão antiga ficavam em arquivos (pasta uploads).
// Aqui elas são copiadas para dentro do banco, uma única vez, para o projeto
// continuar funcionando mesmo depois de ser movido de pasta.
export async function importarUploads() {
  const registros = await Registro.findAll();

  for (const registro of registros) {
    const nova = [];
    let mudou = false;

    for (const caminho of listaImagens(registro)) {
      if (caminho.startsWith("/uploads/")) {
        try {
          const nomeArquivo = path.basename(caminho);
          const dados = await fs.readFile(path.join(pastaUploads, nomeArquivo));
          const imagem = await Imagem.create({
            mime: mimePorExtensao(nomeArquivo),
            dados,
          });

          nova.push(`/api/imagens/${imagem.id}`);
          mudou = true;
          continue;
        } catch {
          // Arquivo não encontrado: mantém o caminho antigo como está.
        }
      }

      nova.push(caminho);
    }

    if (mudou) {
      await registro.update({ imagens: JSON.stringify(nova), imagem: null });
      console.log(`Imagens do registro ${registro.id} copiadas para o banco.`);
    }
  }
}
