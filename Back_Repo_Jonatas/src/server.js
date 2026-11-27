import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";

import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // Garante que a pasta do banco exista.
    await fs.mkdir(path.resolve("database"), {
      recursive: true,
    });

    // Testa a conexão.
    await sequelize.authenticate();

    console.log("Banco de dados conectado!");

    await sequelize.sync();

    console.log("Tabelas sincronizadas!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar o servidor:", erro);
  }
  ;
}

iniciarServidor();
