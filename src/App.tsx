import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import { MainPage } from "./pages/main-page";
import { Layout } from "./components/layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handbook" element={<MainPage />} />
          <Route path="/scanner" element={<MainPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
