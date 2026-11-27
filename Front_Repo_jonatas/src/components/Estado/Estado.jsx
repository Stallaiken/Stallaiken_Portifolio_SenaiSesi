//Função de carregamento e caso esqueça de iniciar o banco de dados
function Estado({ tipo = "vazio", children }) {
  if (tipo === "carregando") {
    return <div className="estado">Carregando…</div>;
  }

  if (tipo === "erro") {
    return (
      <div className="estado erro">
        {children}
        <small>
          Confira se o back-end está rodando (npm run dev em Back_Repo_Jonatas).
        </small>
      </div>
    );
  }

  return <div className="estado">{children}</div>;
}

export default Estado;
