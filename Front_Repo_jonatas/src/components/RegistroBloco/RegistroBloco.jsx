import { urlImagem } from "../../services/api.js";
import { camposSenai, listaImagens, listaVideos } from "../../utils/registro.js";
import { SECOES_POR_TIPO, TIPOS, TOPICOS_SENAI } from "../../utils/rotulos.js";
import "./RegistroBloco.css";

function Galeria({ imagens, titulo }) {
  return (
    <div className="bloco-galeria">
      {imagens.map((caminho) => (
        <a key={caminho} href={urlImagem(caminho)} target="_blank" rel="noreferrer">
          <img src={urlImagem(caminho)} alt={titulo} loading="lazy" />
        </a>
      ))}
    </div>
  );
}

// Monta os tópicos de um registro: lista de { rotulo, conteudo }.
function montarTopicos(registro, imagens) {
  const instituicao = registro.materia?.instituicao;

  if (instituicao === "SENAI") {
    const campos = camposSenai(registro);
    const topicos = [];

    for (const [campo, rotulo] of TOPICOS_SENAI) {
      if (campo === "registros_fotograficos") {
        if (imagens.length > 0) {
          topicos.push({ rotulo, conteudo: <Galeria imagens={imagens} titulo={registro.titulo} /> });
        }
      } else if (campo === "videos") {
        const links = listaVideos(campos.videos);

        if (links.length > 0) {
          topicos.push({
            rotulo,
            conteudo: (
              <ul className="bloco-links">
                {links.map((link) => (
                  <li key={link}>
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ),
          });
        }
      } else if (campos[campo].trim()) {
        topicos.push({
          rotulo,
          conteudo:
            campo === "codigos_produzidos" ? (
              <pre className="bloco-codigo">{campos[campo]}</pre>
            ) : (
              <p>{campos[campo]}</p>
            ),
        });
      }
    }

    return topicos;
  }

  // SESI
  const topicos = (SECOES_POR_TIPO[registro.tipo] || [])
    .filter(([campo]) => registro[campo])
    .map(([campo, rotulo]) => ({ rotulo, conteudo: <p>{registro[campo]}</p> }));

  if (imagens.length > 0) {
    topicos.push({
      rotulo: "Imagens",
      conteudo: <Galeria imagens={imagens} titulo={registro.titulo} />,
    });
  }

  return topicos;
}

// Cada atividade é um único bloco, com os tópicos dentro, sem divisões.
function RegistroBloco({ registro }) {
  const topicos = montarTopicos(registro, listaImagens(registro));
  const ehSenai = registro.materia?.instituicao === "SENAI";

  return (
    <article className="registro-bloco">
      <header>
        <h2>{registro.titulo}</h2>

        <div className="registro-bloco-tags">
          {!ehSenai && (
            <span className="badge">{TIPOS[registro.tipo] || registro.tipo}</span>
          )}
          {registro.bimestre && (
            <span className="badge">{registro.bimestre}º bimestre</span>
          )}
          {registro.materia?.nome && (
            <span className="badge">{registro.materia.nome}</span>
          )}
        </div>
      </header>

      {topicos.map((topico) => (
        <section key={topico.rotulo} className="bloco-topico">
          <h3>{topico.rotulo}</h3>
          {topico.conteudo}
        </section>
      ))}
    </article>
  );
}

export default RegistroBloco;
