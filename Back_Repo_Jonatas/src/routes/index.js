
import express from 'express';

import aluno from '../controllers/AlunoController.js';
import materia from '../controllers/materiaController.js';
import registro from '../controllers/registroController.js';
import reflexao from '../controllers/reflexaoController.js';

const router = express.Router();

function registrarRotas(caminho, controller) {
    router.get(`/${caminho}`, controller.listar);
    router.get(`/${caminho}/:id`, controller.buscar);
    router.post(`/${caminho}`, controller.criar);
    router.put(`/${caminho}/:id`, controller.atualizar);
    router.delete(`/${caminho}/:id`, controller.excluir);
}

registrarRotas('alunos', aluno);
registrarRotas('materias', materia);
registrarRotas('registros', registro);
registrarRotas('reflexoes', reflexao);

export default router;
