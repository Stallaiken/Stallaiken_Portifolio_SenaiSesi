import "./FilterBar.css";

// Grupo de botões "pílula". Cada opção: { valor, texto }.
function Grupo({ titulo, opcoes, valor, onChange }) {
  return (
    <div className="filter-group">
      <span>{titulo}</span>

      <div className="filter-pills">
        {opcoes.map((opcao) => (
          <button
            type="button"
            key={opcao.valor}
            className={String(valor) === String(opcao.valor) ? "active" : ""}
            onClick={() => onChange(opcao.valor)}
          >
            {opcao.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterBar({ grupos }) {
  return (
    <div className="filter-bar">
      {grupos.map((grupo) => (
        <Grupo key={grupo.titulo} {...grupo} />
      ))}
    </div>
  );
}

export default FilterBar;
