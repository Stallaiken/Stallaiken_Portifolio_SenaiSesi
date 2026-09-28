import { Link } from "react-router-dom";
import "../Navbar/NavBar.css";
import teste from "../../assets/react.svg"
const NavBar = () => {
  return (
    <div className="Navbar">
      <p>ESCOLHA A INSTITUIÇÃO: </p>
      <Link to="/" className="Links"> APRESENTAÇÃO </Link>
      -
      <Link to="/Sesi" className="Links"> SESI +_+  </Link>
      -
      <Link to="/senai" className="Links"> SENAI +_+ </Link>

    </div>
  );
};

export default NavBar;
