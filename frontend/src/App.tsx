import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './App.css';
import './styles/main.scss';

import Header from './components/Header';

import MainPage from './pages/MainPage';
import SignUpPage from './pages/SignUpPage';

const App = () => {
  const location = useLocation();
  return (
    <RecoilRoot>
      <div className="App">
        {location.pathname === '/signup' ? '' : <Header />}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </RecoilRoot>
  );
};

export default App;
