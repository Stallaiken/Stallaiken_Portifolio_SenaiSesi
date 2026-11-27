import { Sequelize } from "sequelize";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaBanco = path.resolve(__dirname, "../../database");

// Garante que a pasta do banco exista, de qualquer diretório que o servidor seja iniciado.
fs.mkdirSync(pastaBanco, { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(pastaBanco, "portfolio.sqlite"),
  logging: false,
});

export default sequelize;
