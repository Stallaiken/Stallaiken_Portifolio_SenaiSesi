import express from "express";

import aluno from "../controllers/AlunoController.js";
import materia from "../controllers/materiaController.js";
import registro from "../controllers/registroController.js";
import reflexao from "../controllers/reflexaoController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

function registrarRotas(caminho, controller) {
  router.get(`/${caminho}`, controller.listar);
  router.get(`/${caminho}/:id`, controller.buscar);
  router.post(`/${caminho}`, controller.criar);
  router.put(`/${caminho}/:id`, controller.atualizar);
  router.delete(`/${caminho}/:id`, controller.excluir);
}

registrarRotas("alunos", aluno);
registrarRotas("materias", materia);
registrarRotas("reflexoes", reflexao);

// Registros aceitam upload de imagem (campo "imagem").
function anexarImagem(req, res, next) {
  if (req.file) {
    req.body.imagem = `/uploads/${req.file.filename}`;
  }

  next();
}

router.get("/registros", registro.listar);
router.get("/registros/:id", registro.buscar);
router.post("/registros", upload.single("imagem"), anexarImagem, registro.criar);
router.put(
  "/registros/:id",
  upload.single("imagem"),
  anexarImagem,
  registro.atualizar,
);
router.delete("/registros/:id", registro.excluir);

export default router;
