import { NavLink } from "react-router-dom";

import "./NavBar.css";

const links = [
  { to: "/", texto: "Apresentação", end: true },
  { to: "/quem-sou-eu", texto: "Quem sou eu?" },
  { to: "/sesi", texto: "SESI" },
  { to: "/senai", texto: "SENAI" },
];

function NavBar() {
  return (
    <header className="navbar">
      <span className="navbar-title">Portfólio digital</span>

      <nav className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className="navbar-link"
          >
            {link.texto}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default NavBar;
