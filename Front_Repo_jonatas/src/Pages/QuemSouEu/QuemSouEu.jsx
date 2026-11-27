import { api } from "../../services/api.js";
import { useApi } from "../../hooks/useApi.js";
import { REFLEXOES } from "../../utils/rotulos.js";
import Estado from "../../components/Estado/Estado.jsx";
import "./QuemSouEu.css";

const NOME_PADRAO = "Jonatas Stallaiken Costa Lima Pereira";

// Perfil do aluno + reflexões anuais.
function QuemSouEu() {
  const { data, loading, error } = useApi(async () => {
    const [alunos, reflexoes] = await Promise.all([
      api.listarAlunos(),
      api.listarReflexoes(),
    ]);

    return { aluno: alunos[0] || null, reflexao: reflexoes[0] || null };
  });

  const aluno = data?.aluno;
  const reflexao = data?.reflexao;
  const nome = aluno?.nome || NOME_PADRAO;

  const dados = [
    ["Série", aluno?.serie],
    ["Turma", aluno?.turma],
    ["Itinerário formativo", aluno?.itinerario],
  ].filter(([, valor]) => valor);

  return (
    <section className="quem">
      <div className="quem-perfil">
        <div className="quem-avatar">{nome[0]}</div>

        <div>
          <h1 className="page-title">{nome}</h1>

          <dl className="quem-dados">
            {dados.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {loading && <Estado tipo="carregando" />}
      {error && <Estado tipo="erro">{error}</Estado>}

      {reflexao &&
        REFLEXOES.filter(([campo]) => reflexao[campo]).map(([campo, titulo]) => (
          <article key={campo} className="quem-reflexao">
            <h2>{titulo}</h2>
            <p>{reflexao[campo]}</p>
          </article>
        ))}

      {data && !reflexao && <Estado>Ainda não há reflexões publicadas.</Estado>}
    </section>
  );
}

export default QuemSouEu;
