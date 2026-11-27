import { Sequelize } from "sequelize";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../../database/portfolio.sqlite"),
  logging: false,
});

export default sequelize;
