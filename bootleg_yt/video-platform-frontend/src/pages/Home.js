import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('videos/');
      console.log('Fetched videos:', data);  // Debug log
      setVideos(data);
      if (data.length > 0) {
        setSelectedVideo(data[0]);
      } else {
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error('Ошибка загрузки видео:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (videoId) => {
    try {
      const { data } = await api.get(`videos/${videoId}/comments/`);
      console.log('Fetched comments:', data);  // Debug log
      setComments(data);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error.response?.data || error.message);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetchComments(selectedVideo.id);
    }
  }, [selectedVideo]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setComments([]);
    setNewComment('');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      console.log('Комментарий пустой');
      return;
    }

    try {
      console.log('Отправка комментария:', { text: newComment });
      const response = await api.post(`videos/${selectedVideo.id}/comments/`, { text: newComment }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Комментарий успешно отправлен:', response.data);
      setNewComment('');
      fetchComments(selectedVideo.id);
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error.response?.data || error.message);
      alert('Ошибка отправки комментария: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log(`Deleting comment ${commentId} for video ${selectedVideo.id}`);  // Debug log
      await api.delete(`videos/${selectedVideo.id}/comments/${commentId}/delete/`);
      alert('Комментарий удален!');
      fetchComments(selectedVideo.id);
    } catch (error) {
      console.error('Ошибка удаления комментария:', error.response?.data || error.message);
      alert('Ошибка удаления комментария: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const updatedData = {
        title: editTitle,
        description: editDescription,
      };
      await api.put(`videos/${editingVideo.id}/edit/`, updatedData);
      alert('Видео обновлено!');
      setEditingVideo(null);
      fetchVideos();
    } catch (error) {
      console.error('Ошибка обновления видео:', error.response?.data || error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await api.delete(`videos/${videoId}/delete/`);
      alert('Видео удалено!');
      setShowDeleteConfirm(null);
      fetchVideos();
    } catch (error) {
      console.error('Ошибка удаления видео:', error);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-300 bg-yellow-50 min-h-screen">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-1">
        <div className="flex flex-1 flex-row gap-6">
          {/* Видео и комментарии слева */}
          <div className="flex-1 flex flex-col items-center justify-start">
            {selectedVideo ? (
              <div className="w-full max-w-[800px] bg-amber-50 rounded-lg shadow-lg p-4 border-4 border-black">
                <h2 className="text-gray-900 text-2xl mb-4">{selectedVideo.title}</h2>
                <video
                  key={selectedVideo.id}
                  controls
                  className="w-full h-[400px] rounded-lg shadow-lg object-contain bg-black mb-4 border-4 border-black"
                >
                  <source src={selectedVideo.file_url} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <p className="text-gray-700 mb-4">{selectedVideo.description}</p>

                {/* Комментарии */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Комментарии</h3>
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="mb-2 p-2 bg-orange-100 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-gray-900">{comment.text}</p>
                            <span className="text-sm text-gray-500">{comment.user}</span>
                          </div>
                          {comment.is_owner && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-pink-600 hover:text-pink-700"
                              title="Удалить комментарий"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Комментариев пока нет.</p>
                    )}
                  </div>
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Добавьте комментарий..."
                      rows="3"
                      required
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 text-center">
                <p className="text-2xl">Выберите видео из списка</p>
              </div>
            )}
          </div>

          {/* Список видео справа */}
          <div className="w-1/3 bg-orange-50 rounded-lg shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-250px)] border-4 border-black">
            <h2 className="text-gray-900 text-lg font-bold mb-4">Доступные видео</h2>
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer ${selectedVideo && selectedVideo.id === video.id ? 'bg-orange-100' : 'bg-orange-50'} hover:bg-orange-100 transition duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <p onClick={() => handleSelectVideo(video)} className="text-gray-900 text-sm">
                      {video.title}
                    </p>
                    {video.is_owner && (
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEditVideo(video)} className="text-pink-600 hover:text-pink-700">
                          ✏️
                        </button>
                        <button onClick={() => setShowDeleteConfirm(video.id)} className="text-pink-600 hover:text-pink-700">
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">У вас пока нет видео</p>
                <Link
                  to="/upload"
                  className="mt-2 inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Загрузить первое видео
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна редактирования и удаления видео */}
      {editingVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-yellow-50 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Редактировать видео</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="text-pink-600 hover:text-pink-700"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Подтверждение удаления видео */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-yellow-50 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Удалить видео</h3>
            <p className="text-gray-700 mb-4">Вы уверены, что хотите удалить это видео?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-pink-600 hover:text-pink-700"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteVideo(showDeleteConfirm)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
