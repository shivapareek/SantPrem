import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-orange-600">🕊️ Man Mandir</h1>
      <div className="space-x-4 text-sm md:text-base">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <Link to="/bhajan" className="hover:text-orange-600">Bhajan</Link>
        <Link to="/vaani" className="hover:text-orange-600">Vaani</Link>
        <Link to="/chatbot" className="hover:text-orange-600">ChatBot</Link>
        <Link to="/diary" className="hover:text-orange-600">Diary</Link>
        <Link to="/meditation" className="hover:text-orange-600">Meditation</Link>
      </div>
    </nav>
  );
};

export default Navbar;
