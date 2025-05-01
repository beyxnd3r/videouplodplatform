import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Логотип */}
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-extrabold tracking-wide uppercase hover:text-gray-400 transition duration-300">
            BEYOND
          </Link>
        </div>

        {/* Центр: Информация */}
        <div className="text-center text-sm">
          <p>© 2025 BEYOND. All rights reserved.</p>
          <p className="text-gray-400">Лучшая видеоплатформа</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
