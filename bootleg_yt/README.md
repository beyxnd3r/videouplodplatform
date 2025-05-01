# Video Platform

Тестовая видеоплатформа, разработанная с использованием Python (Django) для бэкенда и React JS для фронтенда.

## Описание
Платформа позволяет пользователям регистрироваться, загружать видео, просматривать их, редактировать и удалять. Реализован адаптивный дизайн на основе макета из Figma.

https://www.figma.com/design/SQo7GGx4kondK2OI2mT9Ek/03_%D0%A0%D0%93%D0%97?node-id=1-115&t=pb0vKP5XRrjxYGVd-1 - Figma Макет 

## Технологии
- Бэкенд: Python, Django, Django REST Framework
- Фронтенд: React JS, Tailwind CSS
- Авторизация: JWT (rest_framework_simplejwt)
- База данных: SQLite (для разработки)

## Установка
1. Бэкенд:
   - Установите зависимости: pip install -r requirements.txt
   - Выполните миграции: python manage.py migrate
   - Запустите сервер: python manage.py runserver

2. Фронтенд:
   - Перейдите в папку фронтенда: cd frontend
   - Установите зависимости: npm install
   - Запустите приложение: npm start

## API
- GET /api/videos/ — список видео
- POST /api/videos/upload/ — загрузка видео
- PUT /api/videos/<id>/edit/ — редактирование видео
- DELETE /api/videos/<id>/delete/ — удаление видео

## Документация
- [API Документация](docs/API.md)