import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import { MainPage } from "./pages/main-page";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/handbook" element={<MainPage />} />
        <Route path="/scanner" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
