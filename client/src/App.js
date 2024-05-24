import './App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form, Input, Card, Statistic } from 'antd';
import { CreateGameForm } from './ui/CreateGameForm';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { GameCard }from './ui/GameCard';
import Main from './ui/Main';
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
const { Header, Content } = Layout;

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
