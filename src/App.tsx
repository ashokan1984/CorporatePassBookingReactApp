// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BookingList from './components/BookingList';
import FacilityList from './components/FacilityList';
import VisitorList from './components/VisitorList';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/facilities" element={<FacilityList />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/visitors" element={<VisitorList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
