# API Документация

## Аутентификация
- POST /api/token/ — получить JWT-токен
  - Тело запроса: {"username": "user", "password": "pass"}
  - Ответ: {"access": "...", "refresh": "..."}

## Видео
- GET /api/videos/ — список видео
  - Ответ: [{"id": 1, "title": "Video 1", "description": "...", "file_url": "...", "created_at": "...", "is_owner": true}, ...]
- POST /api/videos/upload/ — загрузка видео
  - Тело: multipart/form-data с полями title, description, file
- PUT /api/videos/<id>/edit/ — редактирование видео
  - Тело: {"title": "New Title", "description": "New Description"}
- DELETE /api/videos/<id>/delete/ — удаление видео