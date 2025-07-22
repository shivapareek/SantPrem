import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import BhajanZone from "./pages/BhajanZone";
import VaaniZone from "./pages/VaaniZone";
import ChatbotZone from "./pages/ChatbotZone";
import DiaryZone from "./pages/DiaryZone";
import MeditationZone from "./pages/MeditationZone";


const App = () => {
  return (
    <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-black text-white font-sans">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bhajan" element={<div className="pb-20"><BhajanZone /></div>} />
              <Route path="/vaani" element={<VaaniZone />} />
              <Route path="/chatbot" element={<ChatbotZone />} />
              <Route path="/diary" element={<DiaryZone />} />
              <Route path="/meditation" element={<MeditationZone />} />
            </Routes>
          </div>
        </div>
    </BrowserRouter>
  );
};

export default App;
