import './App.css';
import React from 'react';
import { GameCard }from './ui/GameCard';
import Main from './ui/Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/games/:gameId" element={<GameCard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
