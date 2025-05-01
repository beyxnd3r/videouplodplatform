import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-wide uppercase hover:text-gray-400 transition duration-300">
          BEYOND
        </Link>
        <div className="space-x-4 flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  navigate('/login');
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Выйти
              </button>
              <Link
                to="/upload"
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Загрузить видео
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
