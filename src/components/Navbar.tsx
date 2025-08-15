import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="main-navbar">
      <div className="navbar-content">
        <NavLink to="/home" className="navbar-brand">
          ConnectEd
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;