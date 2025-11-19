import React from 'react';
import './NavBar.css';

function Navbar() {
  const quote = "Consistency beats intensity";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">TO-DO LIST</h1>
        <p className="navbar-quote">{quote}</p>
      </div>
    </nav>
  );
}

export default Navbar;
