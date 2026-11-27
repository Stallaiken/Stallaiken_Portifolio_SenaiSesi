import { api } from "../../services/api.js";
import { useApi } from "../../hooks/useApi.js";
import { GRUPOS_REFLEXAO } from "../../utils/rotulos.js";
import Estado from "../../components/Estado/Estado.jsx";
import "./QuemSouEu.css";

const fotos = import.meta.glob(
  "../../assets/perfil.{jpg,jpeg,png,webp,gif,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);
const FOTO_PERFIL = Object.values(fotos)[0];

const NOME_PADRAO = "Jonatas Stallaiken Costa Lima Pereira";

function QuemSouEu() {
  const { data, loading, error } = useApi(async () => {
    const [alunos, reflexoes, registros] = await Promise.all([
      api.listarAlunos(),
      api.listarReflexoes(),
      api.listarRegistros(),
    ]);

    return {
      aluno: alunos[0] || null,
      reflexao: reflexoes[0] || null,
      registros,
    };
  });

  const aluno = data?.aluno;
  const reflexao = data?.reflexao;
  const nome = aluno?.nome || NOME_PADRAO;

  const total = (instituicao) =>
    (data?.registros || []).filter(
      (r) => r.materia?.instituicao === instituicao,
    ).length;

  const ficha = [
    ["Série", aluno?.serie],
    ["Turma", aluno?.turma],
    ["Itinerário formativo", aluno?.itinerario],
  ].filter(([, valor]) => valor);

  const grupos = reflexao
    ? GRUPOS_REFLEXAO.map((grupo) => ({
        ...grupo,
        campos: grupo.campos.filter(([campo]) => reflexao[campo]),
      })).filter((grupo) => grupo.campos.length > 0)
    : [];

  return (
    <section className="quem">
      <article className="quem-cartilha">
        <div className="quem-topo">
          <div className="quem-avatar">
            {FOTO_PERFIL ? <img src={FOTO_PERFIL} alt={nome} /> : nome[0]}
          </div>

          <div>
            <span className="eyebrow">Ficha do aluno</span>
            <h1>{nome}</h1>
          </div>
        </div>

        {ficha.length > 0 && (
          <dl className="quem-ficha">
            {ficha.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {data && (
          <dl className="quem-numeros">
            <div>
              <dd>{total("SESI")}</dd>
              <dt>registros no SESI</dt>
            </div>
            <div>
              <dd>{total("SENAI")}</dd>
              <dt>atividades no SENAI</dt>
            </div>
          </dl>
        )}
      </article>

      {loading && <Estado tipo="carregando" />}
      {error && <Estado tipo="erro">{error}</Estado>}

      {grupos.length > 0 && (
        <>
          <h2 className="section-title">Reflexões</h2>

          <div className="quem-reflexoes">
            {grupos.map((grupo) => (
              <article key={grupo.titulo} className="quem-grupo">
                <h3>{grupo.titulo}</h3>

                {grupo.campos.map(([campo, rotulo]) => (
                  <div key={campo} className="quem-topico">
                    <h4>{rotulo}</h4>
                    <p>{reflexao[campo]}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </>
      )}

      {data && grupos.length === 0 && (
        <Estado>Ainda não há reflexões publicadas.</Estado>
      )}
    </section>
  );
}

export default QuemSouEu;
