import { useEffect, useState } from "react";

import { api, urlImagem } from "../../services/api.js";
import { camposSenai, listaImagens } from "../../utils/registro.js";
import { REFLEXOES } from "../../utils/rotulos.js";
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
  materiaId: "",
  bimestre: "",
  // SESI
  descricao: "",
  resumo_teorico: "",
  reflexao_pratica: "",
  chamou_atencao: "",
  exemplo_aprendizado: "",
  aplicacao_cotidiano: "",
  autoavaliacao: "",
  // SENAI
  projetos_desenvolvidos: "",
  codigos_produzidos: "",
  videos: "",
  relatorios_tecnicos: "",
  aprendizagens_construidas: "",
  competencias_desenvolvidas: "",
};

const camposParticipacao = [
  ["reflexao_pratica", "Reflexão prática"],
  ["chamou_atencao", "O que chamou atenção?"],
  ["exemplo_aprendizado", "Exemplo ou atividade"],
  ["aplicacao_cotidiano", "Aplicação no cotidiano"],
  ["autoavaliacao", "Autoavaliação"],
];

const alunoInicial = { nome: "", serie: "", itinerario: "", turma: "" };

const reflexaoInicial = Object.fromEntries(
  REFLEXOES.map(([campo]) => [campo, ""]),
);

// Campo de formulário (input ou textarea, conforme "linhas").
function Campo({ rotulo, valor, onChange, linhas, ...resto }) {
  const Tag = linhas ? "textarea" : "input";

  return (
    <label className="admin-field">
      {rotulo}
      <Tag
        rows={linhas}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        {...resto}
      />
    </label>
  );
}

function Admin() {
  const [aba, setAba] = useState("aluno");

  const [aluno, setAluno] = useState(alunoInicial);
  const [alunoId, setAlunoId] = useState(null);

  const [materia, setMateria] = useState({ nome: "", instituicao: "SESI" });
  const [materias, setMaterias] = useState([]);
  const [registros, setRegistros] = useState([]);

  const [registro, setRegistro] = useState(registroInicial);
  const [registroId, setRegistroId] = useState(null);
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);

  const [reflexao, setReflexao] = useState(reflexaoInicial);
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
        setReflexao(
          Object.fromEntries(
            REFLEXOES.map(([campo]) => [campo, reflexoes[0][campo] || ""]),
          ),
        );
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

  // ---------- Aluno ----------
  async function salvarAluno(event) {
    event.preventDefault();

    try {
      if (alunoId) {
        await api.atualizarAluno(alunoId, aluno);
      } else {
        const novo = await api.criarAluno(aluno);
        setAlunoId(novo.id);
      }

      notificar("Dados do aluno salvos com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  // ---------- Matérias ----------
  async function salvarMateria(event) {
    event.preventDefault();

    try {
      await api.criarMateria(materia);
      setMateria({ nome: "", instituicao: "SESI" });
      setMaterias(await api.listarMaterias());
      notificar("Matéria cadastrada com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  async function excluirMateria(item) {
    const aviso = `Excluir a matéria "${item.nome}"? Os registros dela também serão apagados.`;

    if (!window.confirm(aviso)) return;

    try {
      await api.excluirMateria(item.id);
      setMaterias((lista) => lista.filter((m) => m.id !== item.id));
      setRegistros((lista) => lista.filter((r) => r.materiaId !== item.id));
      notificar("Matéria excluída com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  // ---------- Registros ----------
  const materiaSelecionada = materias.find(
    (item) => String(item.id) === String(registro.materiaId),
  );
  const ehSesi = materiaSelecionada?.instituicao === "SESI";
  const ehSenai = materiaSelecionada?.instituicao === "SENAI";

  function alterar(campo) {
    return (valor) => setRegistro((atual) => ({ ...atual, [campo]: valor }));
  }

  function limparFormulario() {
    setRegistro(registroInicial);
    setRegistroId(null);
    setImagensExistentes([]);
    setNovasImagens([]);
  }

  async function salvarRegistro(event) {
    event.preventDefault();

    try {
      const formData = new FormData();

      // Envia todos os campos (inclusive vazios) para permitir limpar textos ao editar.
      Object.entries(registro).forEach(([campo, valor]) => {
        formData.append(campo, valor ?? "");
      });

      // SENAI: atividade, sem bimestre.
      if (ehSenai) {
        formData.set("tipo", "atividade");
        formData.set("bimestre", "");
      }

      // Imagens que continuam no registro + novas imagens enviadas agora.
      formData.append("imagens_existentes", JSON.stringify(imagensExistentes));
      novasImagens.forEach((arquivo) => formData.append("imagens", arquivo));

      if (registroId) {
        await api.atualizarRegistro(registroId, formData);
      } else {
        await api.criarRegistro(formData);
      }

      limparFormulario();
      setRegistros(await api.listarRegistros());
      notificar("Registro salvo com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  function editarRegistro(item) {
    const itemSenai = item.materia?.instituicao === "SENAI";
    const senai = itemSenai ? camposSenai(item) : {};

    const campos = {};

    for (const campo of Object.keys(registroInicial)) {
      campos[campo] = item[campo] ?? "";
    }

    if (itemSenai) {
      // Registros antigos do SENAI são reinterpretados nos tópicos novos.
      for (const campo of [
        "descricao",
        "resumo_teorico",
        "reflexao_pratica",
        "chamou_atencao",
        "exemplo_aprendizado",
        "aplicacao_cotidiano",
      ]) {
        campos[campo] = "";
      }

      Object.assign(campos, senai);
      campos.tipo = "atividade";
    }

    campos.materiaId = String(item.materiaId || "");

    setRegistro(campos);
    setRegistroId(item.id);
    setImagensExistentes(listaImagens(item));
    setNovasImagens([]);
    setAba("registros");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirRegistro(id) {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;

    try {
      await api.excluirRegistro(id);
      setRegistros((lista) => lista.filter((item) => item.id !== id));

      if (registroId === id) limparFormulario();

      notificar("Registro excluído com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  // ---------- Reflexões ----------
  async function salvarReflexao(event) {
    event.preventDefault();

    try {
      if (reflexaoId) {
        await api.atualizarReflexao(reflexaoId, reflexao);
      } else {
        const nova = await api.criarReflexao(reflexao);
        setReflexaoId(nova.id);
      }

      notificar("Reflexões salvas com sucesso!");
    } catch (error) {
      setErro(error.message);
    }
  }

  const blocoImagens = (
    <div className="admin-field">
      {ehSenai ? "Registros fotográficos" : "Imagens"}

      {imagensExistentes.length > 0 && (
        <div className="admin-imagens">
          {imagensExistentes.map((caminho) => (
            <div key={caminho} className="admin-imagem">
              <img src={urlImagem(caminho)} alt="" />
              <button
                type="button"
                title="Remover imagem"
                onClick={() =>
                  setImagensExistentes((lista) =>
                    lista.filter((c) => c !== caminho),
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        key={novasImagens.length === 0 ? "vazio" : "cheio"}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => setNovasImagens(Array.from(e.target.files))}
      />

      {novasImagens.length > 0 && (
        <p className="admin-hint">
          {novasImagens.length} arquivo(s) para enviar:{" "}
          {novasImagens.map((arquivo) => arquivo.name).join(", ")}
        </p>
      )}
    </div>
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

                <Campo
                  rotulo="Nome completo"
                  required
                  valor={aluno.nome}
                  onChange={(v) => setAluno({ ...aluno, nome: v })}
                />

                <div className="admin-grid">
                  <Campo
                    rotulo="Série"
                    valor={aluno.serie}
                    onChange={(v) => setAluno({ ...aluno, serie: v })}
                  />
                  <Campo
                    rotulo="Turma"
                    valor={aluno.turma}
                    onChange={(v) => setAluno({ ...aluno, turma: v })}
                  />
                </div>

                <Campo
                  rotulo="Itinerário formativo"
                  valor={aluno.itinerario}
                  onChange={(v) => setAluno({ ...aluno, itinerario: v })}
                />

                <button className="admin-submit">Salvar dados do aluno</button>
              </form>
            )}

            {aba === "materias" && (
              <div className="admin-section">
                <form className="admin-form" onSubmit={salvarMateria}>
                  <h2>Cadastrar matéria</h2>

                  <Campo
                    rotulo="Nome da matéria"
                    required
                    placeholder="Ex.: Matemática"
                    valor={materia.nome}
                    onChange={(v) => setMateria({ ...materia, nome: v })}
                  />

                  <label className="admin-field">
                    Instituição
                    <select
                      value={materia.instituicao}
                      onChange={(e) =>
                        setMateria({ ...materia, instituicao: e.target.value })
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

                  <Campo
                    rotulo="Título"
                    required
                    valor={registro.titulo}
                    onChange={alterar("titulo")}
                  />

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

                    {ehSesi && (
                      <label className="admin-field">
                        Bimestre
                        <select
                          required
                          value={registro.bimestre}
                          onChange={(e) => alterar("bimestre")(e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n}º bimestre
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  {!materiaSelecionada && (
                    <p className="admin-hint">
                      Escolha a matéria para ver os campos do registro.
                    </p>
                  )}

                  {/* ---------- SESI ---------- */}
                  {ehSesi && (
                    <>
                      <label className="admin-field">
                        Tipo de registro
                        <select
                          value={registro.tipo}
                          onChange={(e) => alterar("tipo")(e.target.value)}
                        >
                          <option value="conteudo">Conteúdo</option>
                          <option value="participacao">Participação</option>
                          <option value="projeto">Projeto</option>
                        </select>
                      </label>

                      {registro.tipo === "conteudo" && (
                        <Campo
                          rotulo="Resumo teórico"
                          linhas="7"
                          required
                          valor={registro.resumo_teorico}
                          onChange={alterar("resumo_teorico")}
                        />
                      )}

                      {registro.tipo === "projeto" && (
                        <Campo
                          rotulo="Descrição do projeto"
                          linhas="7"
                          required
                          valor={registro.descricao}
                          onChange={alterar("descricao")}
                        />
                      )}

                      {registro.tipo === "participacao" &&
                        camposParticipacao.map(([campo, titulo]) => (
                          <Campo
                            key={campo}
                            rotulo={titulo}
                            linhas="4"
                            required
                            valor={registro[campo]}
                            onChange={alterar(campo)}
                          />
                        ))}

                      {blocoImagens}
                    </>
                  )}

                  {/* ---------- SENAI ---------- */}
                  {ehSenai && (
                    <>
                      <Campo
                        rotulo="Projetos desenvolvidos"
                        linhas="4"
                        valor={registro.projetos_desenvolvidos}
                        onChange={alterar("projetos_desenvolvidos")}
                      />
                      <Campo
                        rotulo="Códigos produzidos"
                        linhas="8"
                        spellCheck="false"
                        style={{ fontFamily: "monospace" }}
                        valor={registro.codigos_produzidos}
                        onChange={alterar("codigos_produzidos")}
                      />

                      {blocoImagens}

                      <Campo
                        rotulo="Vídeos (um link por linha)"
                        linhas="3"
                        placeholder="https://..."
                        valor={registro.videos}
                        onChange={alterar("videos")}
                      />
                      <Campo
                        rotulo="Relatórios técnicos"
                        linhas="4"
                        valor={registro.relatorios_tecnicos}
                        onChange={alterar("relatorios_tecnicos")}
                      />
                      <Campo
                        rotulo="Aprendizagens construídas"
                        linhas="4"
                        valor={registro.aprendizagens_construidas}
                        onChange={alterar("aprendizagens_construidas")}
                      />
                      <Campo
                        rotulo="Competências desenvolvidas"
                        linhas="4"
                        valor={registro.competencias_desenvolvidas}
                        onChange={alterar("competencias_desenvolvidas")}
                      />
                      <Campo
                        rotulo="Autoavaliação"
                        linhas="4"
                        valor={registro.autoavaliacao}
                        onChange={alterar("autoavaliacao")}
                      />
                    </>
                  )}

                  <div className="admin-actions">
                    <button className="admin-submit">
                      {registroId ? "Salvar alterações" : "Cadastrar registro"}
                    </button>

                    {registroId && (
                      <button
                        type="button"
                        className="admin-cancel"
                        onClick={limparFormulario}
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
                          {item.materia?.instituicao === "SENAI"
                            ? "Atividade SENAI"
                            : item.tipo}{" "}
                          • {item.materia?.nome || "Matéria"}
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

                {REFLEXOES.map(([campo, titulo]) => (
                  <Campo
                    key={campo}
                    rotulo={titulo}
                    linhas="5"
                    valor={reflexao[campo]}
                    onChange={(v) => setReflexao({ ...reflexao, [campo]: v })}
                  />
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
