import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Portfólio Escolar funcionando!",
  });
});

// Erros (ex.: upload de arquivo inválido) sempre em JSON.
// eslint-disable-next-line no-unused-vars
app.use((erro, req, res, next) => {
  res.status(400).json({ erro: erro.message || "Erro na requisição." });
});

export default app;
