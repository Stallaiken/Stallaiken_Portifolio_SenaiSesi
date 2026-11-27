import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/NavBar.jsx";

import Home from "./Pages/Home/Home.jsx";
import QuemSouEu from "./Pages/QuemSouEu/QuemSouEu.jsx";
import Sesi from "./Pages/Sesi/Sesi.jsx";
import Senai from "./Pages/Senai/Senai.jsx";
import Admin from "./Pages/Admin/Admin.jsx";

function App() {
  return (
    <div className="app-container">
      <div className="app-box">
        <Navbar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quem-sou-eu" element={<QuemSouEu />} />
            <Route path="/sesi" element={<Sesi />} />
            <Route path="/senai" element={<Senai />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="*"
              element={<h1 className="page-title">Página não encontrada</h1>}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
