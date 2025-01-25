import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ClothingList from './components/ClothingList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/clothing/:type" element={<ClothingList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
