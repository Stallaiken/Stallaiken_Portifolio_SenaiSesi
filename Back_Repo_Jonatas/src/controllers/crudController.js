function criarCrud(Model, camposPermitidos, opcoes = {}) {
  const selecionarCampos = (dados) => {
    const resultado = {};

    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        resultado[campo] = dados[campo];
      }
    }

    return resultado;
  };

  return {
    async listar(req, res) {
      try {
        const where = {};

        for (const campo of opcoes.filtros || []) {
          if (req.query[campo] !== undefined) {
            where[campo] = req.query[campo];
          }
        }

        const registros = await Model.findAll({
          where,
          include: opcoes.include || [],
        });

        return res.json(registros);
      } catch (erro) {
        return res.status(500).json({
          erro: "Erro ao listar registros.",
          detalhe: erro.message,
        });
      }
    },

    async buscar(req, res) {
      try {
        const registro = await Model.findByPk(req.params.id, {
          include: opcoes.include || [],
        });

        if (!registro) {
          return res.status(404).json({
            erro: "Registro não encontrado.",
          });
        }

        return res.json(registro);
      } catch (erro) {
        return res.status(500).json({
          erro: "Erro ao buscar registro.",
          detalhe: erro.message,
        });
      }
    },

    async criar(req, res) {
      try {
        const dados = selecionarCampos(req.body);

        if (opcoes.unico && (await Model.count()) > 0) {
          return res.status(409).json({
            erro: "Este registro já existe.",
          });
        }

        if (opcoes.validar) {
          await opcoes.validar(dados);
        }

        const registro = await Model.create(dados);

        return res.status(201).json(registro);
      } catch (erro) {
        return res.status(400).json({
          erro: erro.message || "Erro ao criar registro.",
        });
      }
    },

    async atualizar(req, res) {
      try {
        const registro = await Model.findByPk(req.params.id);

        if (!registro) {
          return res.status(404).json({
            erro: "Registro não encontrado.",
          });
        }

        const dados = {
          ...registro.toJSON(),
          ...selecionarCampos(req.body),
        };

        if (opcoes.validar) {
          await opcoes.validar(dados);
        }

        await registro.update(selecionarCampos(dados));

        return res.json(registro);
      } catch (erro) {
        return res.status(400).json({
          erro: erro.message || "Erro ao atualizar registro.",
        });
      }
    },

    async excluir(req, res) {
      try {
        const registro = await Model.findByPk(req.params.id);

        if (!registro) {
          return res.status(404).json({
            erro: "Registro não encontrado.",
          });
        }

        await registro.destroy();

        return res.json({
          mensagem: "Registro excluído com sucesso.",
        });
      } catch (erro) {
        return res.status(500).json({
          erro: "Erro ao excluir registro.",
          detalhe: erro.message,
        });
      }
    },
  };
}

export default criarCrud;
