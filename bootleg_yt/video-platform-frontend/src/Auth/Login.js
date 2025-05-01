import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('token/', { email, password });
      localStorage.setItem('access_token', data.access);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.detail || 'Неверные данные');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex">
      {/* Левое окно с картинкой и текстом */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg)',  // Ссылка на изображение
          height: '100vh',  // Обеспечиваем, чтобы картинка занимала всю высоту экрана
        }}
      >
        <div className="h-full flex items-end justify-center text-white text-center p-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">Спасибо, что выбираете нас</h2>
            <p>Мы рады, что вы с нами. Войдите, чтобы начать.</p>
          </div>
        </div>
      </div>

      {/* Окно входа справа */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Вход</h2>
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-300"
            >
              Войти
            </button>
          </form>
          <p className="text-center text-gray-900 mt-4">
            Нет аккаунта?{' '}
            <a href="/register" className="text-pink-600 hover:underline">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
