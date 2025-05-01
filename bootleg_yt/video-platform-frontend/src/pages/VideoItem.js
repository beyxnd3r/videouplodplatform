import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const VideoItem = ({ video, onDelete }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: video.title,
    description: video.description,
    file: null,
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDelete = async () => {
    if (window.confirm('Удалить видео?')) {
      try {
        await api.delete(`videos/${video.id}/delete/`);
        onDelete(video.id);
        alert('Видео удалено!');
      } catch (error) {
        setError(error.response?.data?.detail || 'Ошибка удаления');
      }
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', editData.title);
    formData.append('description', editData.description);
    if (editData.file) {
      formData.append('file', editData.file);
    }

    try {
      await api.patch(`videos/${video.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditing(false);
      alert('Изменения сохранены!');
      navigate(0);
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка сохранения');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setEditData({ ...editData, file: e.target.files[0] });
    }
  };

  return (
    <div className="bg-amber-50 border border-gray-700 rounded-lg overflow-hidden shadow-md">
      <div className="relative bg-black">
        <video controls className="w-full aspect-video" poster="/placeholder.jpg">
          <source src={video.file_url} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
      <div className="p-4">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {isEditing ? (
          <div className="space-y-4">
            <input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 bg-white text-darkBg"
              placeholder="Название видео"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 bg-white text-darkBg"
              placeholder="Описание видео"
              rows="3"
            />
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="w-full text-sm text-lightGray file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                Сохранить
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Link to={`/video/${video.id}`} className="hover:underline">
              <h3 className="font-bold text-lg text-white mb-1">{video.title}</h3>
            </Link>
            <p className="text-gray-400">{video.description}</p>
            {video.is_owner && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                >
                  Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoItem;
