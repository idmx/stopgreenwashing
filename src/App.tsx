import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import { MainPage } from "./pages/main-page";
import { Layout } from "./components/layout";
import { HandbookPage } from "./pages/handbook-page";
import { MarkCard } from "./components/mark-card";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handbook" element={<HandbookPage />} />
          <Route path="/handbook/:id" element={<MarkCard />} />
          <Route path="/scanner" element={<MainPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
