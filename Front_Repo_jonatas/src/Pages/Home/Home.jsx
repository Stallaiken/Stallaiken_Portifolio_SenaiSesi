import { Link } from "react-router-dom";

import "./Home.css";

function saudacao() {
  const hora = new Date().getHours();

  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

// Apresentação: só dá as boas-vindas e leva para as outras páginas.
function Home() {
  return (
    <section className="home">
      <span className="eyebrow">Portfólio SESI · SENAI</span>
      <h1>{saudacao()}!</h1>
      <p>
        Aqui está o meu portfólio digital: o que estudei, participei e
        desenvolvi no SESI e no SENAI.
      </p>

      <div className="home-links">
        <Link to="/quem-sou-eu" className="btn btn-primary">
          Quem sou eu?
        </Link>
        <Link to="/sesi" className="btn">
          SESI
        </Link>
        <Link to="/senai" className="btn">
          SENAI
        </Link>
      </div>
    </section>
  );
}

export default Home;
