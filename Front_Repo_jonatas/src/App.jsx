import { useState } from "react";
import "./App.css";
import NavBar from "./components/Navbar/NavBar.jsx";

import { Route, Routes } from "react-router-dom";

import Test from "./components/Test.jsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
