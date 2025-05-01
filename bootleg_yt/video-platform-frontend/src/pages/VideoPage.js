import React, { useState, useEffect } from 'react';
import api from '../api';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Загрузка видео
    const fetchVideos = async () => {
      try {
        const { data } = await api.get('videos/');
        setVideos(data);
      } catch (error) {
        console.error('Ошибка загрузки видео:', error);
      }
    };
    fetchVideos();
  }, []);

  const fetchComments = async (videoId) => {
    try {
      const { data } = await api.get(`comments/?video=${videoId}`);
      setComments(data);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment || selectedVideoId === null) return;

    try {
      await api.post('comments/', { video: selectedVideoId, text: comment });
      alert('Комментарий добавлен!');
      setComment('');
      fetchComments(selectedVideoId); // перезагружаем комментарии для этого видео
    } catch (error) {
      alert('Ошибка добавления комментария');
    }
  };

  return (
    <div className="bg-darkBg min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Главная страница</h1>

        {/* Список видео */}
        <div className="space-y-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-darkBg p-4 rounded-lg">
              <h2 className="text-xl font-bold text-white">{video.title}</h2>
              <video controls className="w-full aspect-video rounded-lg mb-4">
                <source src={video.file || video.file_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>

              {/* Кнопка для отображения комментариев */}
              <button
                onClick={() => {
                  setSelectedVideoId(video.id);
                  fetchComments(video.id); // загружаем комментарии для выбранного видео
                }}
                className="text-white bg-accentBlue px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
              >
                Показать комментарии
              </button>

              {/* Форма для добавления комментария */}
              {selectedVideoId === video.id && (
                <div className="mt-4 bg-darkBg p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Оставить комментарий</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accentBlue placeholder-lightGray bg-white text-darkBg"
                      placeholder="Ваш комментарий"
                      rows="4"
                      required
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-accentBlue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
                    >
                      Отправить
                    </button>
                  </form>

                  {/* Список комментариев */}
                  <div className="mt-6 space-y-4">
                    {comments.length > 0 ? (
                      comments.map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-lg text-darkBg">
                          <p>{c.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-lightGray">Комментариев пока нет</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
