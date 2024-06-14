import React from 'react';
import './App.css';
import ExpenseTracker from './Routes/ExpenseTracker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ExpenseTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
