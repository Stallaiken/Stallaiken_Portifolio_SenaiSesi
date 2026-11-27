import { urlImagem } from "../../services/api.js";
import { SECOES_POR_TIPO, TIPOS } from "../../utils/rotulos.js";
import "./RegistroBloco.css";

// Um registro completo: título, textos e imagem.
function RegistroBloco({ registro }) {
  const imagem = urlImagem(registro.imagem);
  const secoes = (SECOES_POR_TIPO[registro.tipo] || []).filter(
    ([campo]) => registro[campo],
  );

  return (
    <article className="registro-bloco">
      <header>
        <h2>{registro.titulo}</h2>

        <div className="registro-bloco-tags">
          <span className="badge">{TIPOS[registro.tipo] || registro.tipo}</span>
          {registro.bimestre && (
            <span className="badge">{registro.bimestre}º bimestre</span>
          )}
          {registro.materia?.nome && (
            <span className="badge">{registro.materia.nome}</span>
          )}
        </div>
      </header>

      {secoes.map(([campo, titulo]) => (
        <section key={campo} className="registro-bloco-texto">
          {(secoes.length > 1 || registro.tipo === "participacao") && (
            <h3>{titulo}</h3>
          )}
          <p>{registro[campo]}</p>
        </section>
      ))}

      {imagem && (
        <a href={imagem} target="_blank" rel="noreferrer">
          <img src={imagem} alt={registro.titulo} loading="lazy" />
        </a>
      )}
    </article>
  );
}

export default RegistroBloco;
