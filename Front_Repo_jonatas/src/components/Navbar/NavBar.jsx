import { Link } from "react-router-dom";
import "../Navbar/NavBar.css";

const NavBar = () => {
  return (
    <div className="Navbar">
      <p>Portifolio</p>
      <Link to="/"> Inicio</Link>
    </div>
  );
};

export default NavBar;
