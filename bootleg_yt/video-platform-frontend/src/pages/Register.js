import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('users/register/', formData);
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: ['Connection error'] });
      }
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
            <p>Мы рады, что вы с нами. Зарегистрируйтесь, чтобы начать.</p>
          </div>
        </div>
      </div>

      {/* Окно регистрации справа */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Регистрация</h2>
          {errors.non_field_errors && (
            <div className="mb-4 text-red-600 text-center">{errors.non_field_errors}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Электронная почта"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                required
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-5">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Имя"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                required
              />
              {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Пароль"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                required
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-300"
            >
              Зарегистрироваться
            </button>
          </form>
          <p className="text-center text-gray-900 mt-4">
            Уже есть аккаунт?{' '}
            <a href="/login" className="text-pink-600 hover:underline">
              Войти
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
