import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import "./Admin.css";

const abas = [
  { id: "aluno", nome: "Dados do aluno" },
  { id: "materias", nome: "Matérias" },
  { id: "registros", nome: "Registros" },
  { id: "reflexoes", nome: "Reflexões anuais" },
];

const registroInicial = {
  titulo: "",
  tipo: "conteudo",
  descricao: "",
  resumo_teorico: "",
  reflexao_pratica: "",
  chamou_atencao: "",
  exemplo_aprendizado: "",
  aplicacao_cotidiano: "",
  autoavaliacao: "",
  materiaId: "",
  bimestre: "",
};

function Admin() {
  const [aba, setAba] = useState("aluno");

  const [aluno, setAluno] = useState({
    nome: "",
    serie: "",
    itinerario: "",
    turma: "",
  });

  const [alunoId, setAlunoId] = useState(null);

  const [materia, setMateria] = useState({
    nome: "",
    instituicao: "SESI",
  });

  const [materias, setMaterias] = useState([]);
  const [registros, setRegistros] = useState([]);

  const [registro, setRegistro] = useState(registroInicial);
  const [registroId, setRegistroId] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);

  const [reflexao, setReflexao] = useState({
    reflexao_pessoal: "",
    aprendizado_academico: "",
    aplicacao_pratica: "",
    melhorias: "",
    resiliencia: "",
    conexoes_interdisciplinares: "",
    aprendizados_para_vida: "",
  });

  const [reflexaoId, setReflexaoId] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunos, listaMaterias, listaRegistros, reflexoes] =
        await Promise.all([
          api.listarAlunos(),
          api.listarMaterias(),
          api.listarRegistros(),
          api.listarReflexoes(),
        ]);

      if (alunos.length > 0) {
        setAlunoId(alunos[0].id);
        setAluno({
          nome: alunos[0].nome || "",
          serie: alunos[0].serie || "",
          itinerario: alunos[0].itinerario || "",
          turma: alunos[0].turma || "",
        });
      }

      setMaterias(listaMaterias);
      setRegistros(listaRegistros);

      if (reflexoes.length > 0) {
        setReflexaoId(reflexoes[0].id);

        setReflexao({
          reflexao_pessoal: reflexoes[0].reflexao_pessoal || "",
          aprendizado_academico: reflexoes[0].aprendizado_academico || "",
          aplicacao_pratica: reflexoes[0].aplicacao_pratica || "",
          melhorias: reflexoes[0].melhorias || "",
          resiliencia: reflexoes[0].resiliencia || "",
          conexoes_interdisciplinares:
            reflexoes[0].conexoes_interdisciplinares || "",
          aprendizados_para_vida: reflexoes[0].aprendizados_para_vida || "",
        });
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function notificar(texto) {
    setMensagem(texto);
    setErro("");

    setTimeout(() => setMensagem(""), 3500);
  }

  async function salvarAluno(event) {
    event.preventDefault();

    try {
      if (alunoId) {
        await api.atualizarAluno(alunoId, aluno);
      } else {
        const novoAluno = await api.criarAluno(aluno);
        setAlunoId(novoAluno.id);
      }

      notificar("Dados do aluno salvos com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  async function salvarMateria(event) {
    event.preventDefault();

    try {
      await api.criarMateria(materia);

      setMateria({
        nome: "",
        instituicao: "SESI",
      });

      const lista = await api.listarMaterias();
      setMaterias(lista);

      notificar("Matéria cadastrada com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  async function excluirMateria(item) {
    const aviso = `Excluir a matéria "${item.nome}"? Os registros dela também serão apagados.`;

    if (!window.confirm(aviso)) {
      return;
    }

    try {
      await api.excluirMateria(item.id);

      setMaterias((lista) => lista.filter((m) => m.id !== item.id));
      setRegistros((lista) => lista.filter((r) => r.materiaId !== item.id));

      notificar("Matéria excluída com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  async function salvarRegistro(event) {
    event.preventDefault();

    try {
      const formData = new FormData();

      // Envia todos os campos (inclusive vazios) para permitir limpar textos ao editar.
      // No SENAI o bimestre vai vazio e o back-end salva como nulo.
      Object.entries(registro).forEach(([campo, valor]) => {
        formData.append(campo, valor ?? "");
      });

      if (imagem) {
        formData.append("imagem", imagem);
      }

      if (registroId) {
        await api.atualizarRegistro(registroId, formData);
      } else {
        await api.criarRegistro(formData);
      }

      setRegistro(registroInicial);
      setRegistroId(null);
      setImagem(null);
      setImagemAtual(null);

      const lista = await api.listarRegistros();
      setRegistros(lista);

      notificar("Registro salvo com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  function editarRegistro(item) {
    setRegistro({
      titulo: item.titulo || "",
      tipo: item.tipo || "conteudo",
      descricao: item.descricao || "",
      resumo_teorico: item.resumo_teorico || "",
      reflexao_pratica: item.reflexao_pratica || "",
      chamou_atencao: item.chamou_atencao || "",
      exemplo_aprendizado: item.exemplo_aprendizado || "",
      aplicacao_cotidiano: item.aplicacao_cotidiano || "",
      autoavaliacao: item.autoavaliacao || "",
      materiaId: String(item.materiaId || ""),
      bimestre: item.bimestre ?? "",
    });

    setRegistroId(item.id);
    setImagem(null);
    setImagemAtual(item.imagem || null);
    setAba("registros");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirRegistro(id) {
    if (!window.confirm("Deseja realmente excluir este registro?")) {
      return;
    }

    try {
      await api.excluirRegistro(id);

      setRegistros((lista) => lista.filter((item) => item.id !== id));

      if (registroId === id) {
        cancelarEdicao();
      }

      notificar("Registro excluído com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  function cancelarEdicao() {
    setRegistro(registroInicial);
    setRegistroId(null);
    setImagem(null);
    setImagemAtual(null);
  }

  async function salvarReflexao(event) {
    event.preventDefault();

    try {
      if (reflexaoId) {
        await api.atualizarReflexao(reflexaoId, reflexao);
      } else {
        const novaReflexao = await api.criarReflexao(reflexao);
        setReflexaoId(novaReflexao.id);
      }

      notificar("Reflexões salvas com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  const materiaSelecionada = materias.find(
    (item) => String(item.id) === String(registro.materiaId),
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>PORTFÓLIO</span>
          <small>Administração</small>
        </div>

        <nav className="admin-menu">
          {abas.map((item) => (
            <button
              key={item.id}
              className={aba === item.id ? "active" : ""}
              onClick={() => setAba(item.id)}
            >
              {item.nome}
            </button>
          ))}
        </nav>

        <button className="admin-refresh" onClick={carregarDados}>
          Atualizar informações
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>GERENCIAMENTO</span>
            <h1>{abas.find((item) => item.id === aba)?.nome}</h1>
          </div>
        </header>

        {mensagem && <div className="admin-message success">{mensagem}</div>}

        {erro && <div className="admin-message error">{erro}</div>}

        {carregando ? (
          <p>Carregando informações...</p>
        ) : (
          <>
            {aba === "aluno" && (
              <form className="admin-form" onSubmit={salvarAluno}>
                <h2>Informações pessoais</h2>

                <label className="admin-field">
                  Nome completo
                  <input
                    required
                    value={aluno.nome}
                    onChange={(e) =>
                      setAluno({
                        ...aluno,
                        nome: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="admin-grid">
                  <label className="admin-field">
                    Série
                    <input
                      value={aluno.serie}
                      onChange={(e) =>
                        setAluno({
                          ...aluno,
                          serie: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="admin-field">
                    Turma
                    <input
                      value={aluno.turma}
                      onChange={(e) =>
                        setAluno({
                          ...aluno,
                          turma: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label className="admin-field">
                  Itinerário formativo
                  <input
                    value={aluno.itinerario}
                    onChange={(e) =>
                      setAluno({
                        ...aluno,
                        itinerario: e.target.value,
                      })
                    }
                  />
                </label>

                <button className="admin-submit">Salvar dados do aluno</button>
              </form>
            )}

            {aba === "materias" && (
              <div className="admin-section">
                <form className="admin-form" onSubmit={salvarMateria}>
                  <h2>Cadastrar matéria</h2>

                  <label className="admin-field">
                    Nome da matéria
                    <input
                      required
                      value={materia.nome}
                      onChange={(e) =>
                        setMateria({
                          ...materia,
                          nome: e.target.value,
                        })
                      }
                      placeholder="Ex.: Matemática"
                    />
                  </label>

                  <label className="admin-field">
                    Instituição
                    <select
                      value={materia.instituicao}
                      onChange={(e) =>
                        setMateria({
                          ...materia,
                          instituicao: e.target.value,
                        })
                      }
                    >
                      <option value="SESI">SESI</option>
                      <option value="SENAI">SENAI</option>
                    </select>
                  </label>

                  <button className="admin-submit">Cadastrar matéria</button>
                </form>

                <section className="admin-form">
                  <h2>Matérias cadastradas</h2>

                  {materias.map((item) => (
                    <div className="admin-list-item" key={item.id}>
                      <div>
                        <strong>{item.nome}</strong>
                        <small>{item.instituicao}</small>
                      </div>

                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => excluirMateria(item)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}

                  {materias.length === 0 && <p>Nenhuma matéria cadastrada.</p>}
                </section>
              </div>
            )}

            {aba === "registros" && (
              <div className="admin-section">
                <form className="admin-form" onSubmit={salvarRegistro}>
                  <h2>{registroId ? "Editar registro" : "Novo registro"}</h2>

                  <label className="admin-field">
                    Tipo de registro
                    <select
                      value={registro.tipo}
                      onChange={(e) =>
                        setRegistro({
                          ...registro,
                          tipo: e.target.value,
                        })
                      }
                    >
                      <option value="conteudo">Conteúdo</option>
                      <option value="participacao">Participação</option>
                      <option value="projeto">Projeto</option>
                    </select>
                  </label>

                  <label className="admin-field">
                    Título
                    <input
                      required
                      value={registro.titulo}
                      onChange={(e) =>
                        setRegistro({
                          ...registro,
                          titulo: e.target.value,
                        })
                      }
                    />
                  </label>

                  <div className="admin-grid">
                    <label className="admin-field">
                      Matéria
                      <select
                        required
                        value={registro.materiaId}
                        onChange={(e) =>
                          setRegistro({
                            ...registro,
                            materiaId: e.target.value,
                            bimestre: "",
                          })
                        }
                      >
                        <option value="">Selecione</option>
                        {materias.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nome} - {item.instituicao}
                          </option>
                        ))}
                      </select>
                    </label>

                    {materiaSelecionada?.instituicao === "SESI" && (
                      <label className="admin-field">
                        Bimestre
                        <select
                          required
                          value={registro.bimestre}
                          onChange={(e) =>
                            setRegistro({
                              ...registro,
                              bimestre: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="1">1º bimestre</option>
                          <option value="2">2º bimestre</option>
                          <option value="3">3º bimestre</option>
                          <option value="4">4º bimestre</option>
                        </select>
                      </label>
                    )}
                  </div>

                  {registro.tipo === "conteudo" && (
                    <label className="admin-field">
                      Resumo teórico
                      <textarea
                        required
                        rows="7"
                        value={registro.resumo_teorico}
                        onChange={(e) =>
                          setRegistro({
                            ...registro,
                            resumo_teorico: e.target.value,
                          })
                        }
                      />
                    </label>
                  )}

                  {registro.tipo === "projeto" && (
                    <label className="admin-field">
                      Descrição do projeto
                      <textarea
                        required
                        rows="7"
                        value={registro.descricao}
                        onChange={(e) =>
                          setRegistro({
                            ...registro,
                            descricao: e.target.value,
                          })
                        }
                      />
                    </label>
                  )}

                  {registro.tipo === "participacao" && (
                    <>
                      {[
                        ["reflexao_pratica", "Reflexão prática"],
                        ["chamou_atencao", "O que chamou atenção?"],
                        ["exemplo_aprendizado", "Exemplo ou atividade"],
                        ["aplicacao_cotidiano", "Aplicação no cotidiano"],
                        ["autoavaliacao", "Autoavaliação"],
                      ].map(([campo, titulo]) => (
                        <label className="admin-field" key={campo}>
                          {titulo}
                          <textarea
                            required
                            rows="4"
                            value={registro[campo]}
                            onChange={(e) =>
                              setRegistro({
                                ...registro,
                                [campo]: e.target.value,
                              })
                            }
                          />
                        </label>
                      ))}
                    </>
                  )}

                  <label className="admin-field">
                    Imagem
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => setImagem(e.target.files[0] || null)}
                    />
                  </label>

                  {imagem && (
                    <p className="admin-hint">
                      Arquivo selecionado: {imagem.name}
                    </p>
                  )}

                  {!imagem && imagemAtual && (
                    <p className="admin-hint">
                      Este registro já possui uma imagem. Envie outra para
                      substituí-la.
                    </p>
                  )}

                  <div className="admin-actions">
                    <button className="admin-submit">
                      {registroId ? "Salvar alterações" : "Cadastrar registro"}
                    </button>

                    {registroId && (
                      <button
                        type="button"
                        className="admin-cancel"
                        onClick={cancelarEdicao}
                      >
                        Cancelar edição
                      </button>
                    )}
                  </div>
                </form>

                <section className="admin-form">
                  <h2>Registros existentes</h2>

                  {registros.map((item) => (
                    <div className="admin-list-item" key={item.id}>
                      <div>
                        <strong>{item.titulo}</strong>
                        <small>
                          {item.tipo} •{" "}
                          {item.materia?.nome || "Matéria"}
                        </small>
                      </div>

                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-edit"
                          onClick={() => editarRegistro(item)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => excluirRegistro(item.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}

                  {registros.length === 0 && <p>Nenhum registro cadastrado.</p>}
                </section>
              </div>
            )}

            {aba === "reflexoes" && (
              <form className="admin-form" onSubmit={salvarReflexao}>
                <h2>Reflexões anuais</h2>

                {[
                  ["reflexao_pessoal", "Expectativas e objetivos pessoais"],
                  ["aprendizado_academico", "Aprendizado acadêmico"],
                  ["aplicacao_pratica", "Aplicação prática"],
                  ["melhorias", "O que desejo melhorar"],
                  ["resiliencia", "Resiliência e solução de problemas"],
                  [
                    "conexoes_interdisciplinares",
                    "Conexões interdisciplinares",
                  ],
                  [
                    "aprendizados_para_vida",
                    "Aprendizados da escola para a vida",
                  ],
                ].map(([campo, titulo]) => (
                  <label className="admin-field" key={campo}>
                    {titulo}
                    <textarea
                      rows="5"
                      value={reflexao[campo]}
                      onChange={(e) =>
                        setReflexao({
                          ...reflexao,
                          [campo]: e.target.value,
                        })
                      }
                    />
                  </label>
                ))}

                <button className="admin-submit">Salvar reflexões</button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Admin;
