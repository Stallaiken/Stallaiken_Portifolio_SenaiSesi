import express from "express";

import aluno from "../controllers/AlunoController.js";
import materia from "../controllers/materiaController.js";
import registro, { prepararImagens } from "../controllers/registroController.js";
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

// Registros aceitam várias imagens (campo "imagens").
const enviarImagens = upload.array("imagens", 12);

router.get("/registros", registro.listar);
router.get("/registros/:id", registro.buscar);
router.post("/registros", enviarImagens, prepararImagens, registro.criar);
router.put("/registros/:id", enviarImagens, prepararImagens, registro.atualizar);
router.delete("/registros/:id", registro.excluir);

export default router;
