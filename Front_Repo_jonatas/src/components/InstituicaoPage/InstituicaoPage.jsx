import { useState } from "react";

import { api } from "../../services/api.js";
import { useApi } from "../../hooks/useApi.js";
import { TIPOS } from "../../utils/rotulos.js";
import FilterBar from "../FilterBar/FilterBar.jsx";
import RegistroBloco from "../RegistroBloco/RegistroBloco.jsx";
import Estado from "../Estado/Estado.jsx";
import "./InstituicaoPage.css";

function InstituicaoPage({ instituicao, titulo, descricao }) {
  const [materiaId, setMateriaId] = useState("");
  const [tipo, setTipo] = useState("");
  const [bimestre, setBimestre] = useState("");

  const { data, loading, error } = useApi(async () => {
    const [materias, registros] = await Promise.all([
      api.listarMaterias(instituicao),
      api.listarRegistros(),
    ]);

    return {
      materias,
      registros: registros.filter(
        (registro) => registro.materia?.instituicao === instituicao,
      ),
    };
  }, [instituicao]);

  const registros = (data?.registros || []).filter(
    (registro) =>
      (!materiaId || String(registro.materiaId) === String(materiaId)) &&
      (!tipo || registro.tipo === tipo) &&
      (!bimestre || String(registro.bimestre) === String(bimestre)),
  );

  const grupos =
    instituicao === "SESI"
      ? [
          {
            titulo: "Tipo",
            valor: tipo,
            onChange: setTipo,
            opcoes: [
              { valor: "", texto: "Todos" },
              ...Object.entries(TIPOS).map(([valor, texto]) => ({
                valor,
                texto,
              })),
            ],
          },
          {
            titulo: "Bimestre",
            valor: bimestre,
            onChange: setBimestre,
            opcoes: [
              { valor: "", texto: "Todos" },
              ...[1, 2, 3, 4].map((n) => ({ valor: n, texto: `${n}º` })),
            ],
          },
        ]
      : [];

  const materias = data?.materias || [];

  return (
    <section>
      <div className="inst-cabecalho">
        <span className="eyebrow">{instituicao}</span>
        <h1 className="page-title">{titulo}</h1>
        <p className="page-subtitle">{descricao}</p>
      </div>

      {loading && <Estado tipo="carregando" />}
      {error && <Estado tipo="erro">{error}</Estado>}

      {data && (
        <>
          <div className="inst-abas">
            {[{ id: "", nome: "Todas" }, ...materias].map((materia) => (
              <button
                type="button"
                key={materia.id}
                className={
                  String(materiaId) === String(materia.id) ? "active" : ""
                }
                onClick={() => setMateriaId(materia.id)}
              >
                {materia.nome}
              </button>
            ))}
          </div>

          {grupos.length > 0 && <FilterBar grupos={grupos} />}

          {registros.length === 0 ? (
            <Estado>Nenhum registro encontrado.</Estado>
          ) : (
            <div className="inst-lista">
              {registros.map((registro) => (
                <RegistroBloco key={registro.id} registro={registro} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default InstituicaoPage;
