// components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul>
        <li>
          <Link to="/facilities">Facilities</Link>
        </li>
        <li>
          <Link to="/bookings">Bookings</Link>
        </li>
        <li>
          <Link to="/visitors">Visitors</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
