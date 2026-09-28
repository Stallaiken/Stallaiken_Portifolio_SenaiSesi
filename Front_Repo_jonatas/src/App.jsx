import "./App.css";

import { Route, Routes } from "react-router-dom";
import Article from "./components/Article/Article.jsx";
import NavBar from "./components/Navbar/NavBar.jsx";
import Sesi from "./components/SesiFolder/sesi.jsx";
import Senai from "./components/SenaiFolder/Senai.jsx";

function App() {
  return (
    <>  

    <div className="Box-assunto">
      <NavBar/>
        <Routes>
          <Route path="/" element={<Article />} />
          <Route path="/Sesi" element={<Sesi/>}/>
          <Route path="/Senai" element={<Senai/>}/>
       </Routes>
    </div>

    </>
  );
}

export default App;
