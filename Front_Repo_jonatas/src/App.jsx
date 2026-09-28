import { useState } from "react";
import "./App.css";


import { Route, Routes } from "react-router-dom";
import Article from "./components/Article/Article.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Article />} />
      </Routes>
    </>
  );
}

export default App;
