from django.urls import path, include
from .views import VideoUploadView, VideoUpdateAPIView, VideoDeleteAPIView, VideoRetrieveAPIView, VideoListView, CommentView, CommentDeleteView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Схема документации для этого приложения
schema_view = get_schema_view(
    openapi.Info(
        title="Video Platform API - Videos",
        default_version='v1',
        description="Video related API endpoints",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@videoplatform.local"),
        license=openapi.License(name="MIT"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Список всех видео
    path('', VideoListView.as_view(), name='video-list'),
    # Загрузка видео
    path('upload/', VideoUploadView.as_view(), name='video-upload'),
    # Получение, обновление и удаление видео
    path('<int:pk>/', VideoRetrieveAPIView.as_view(), name='video-detail'),
    path('<int:pk>/edit/', VideoUpdateAPIView.as_view(), name='video-edit'),  # Для PUT-запросов
    path('<int:pk>/delete/', VideoDeleteAPIView.as_view(), name='video-delete'),  # Для DELETE-запросов
    # Комментарии к видео
    path('<int:video_id>/comments/', CommentView.as_view(), name='video-comments'),
    # Удаление комментария
    path('<int:video_id>/comments/<int:comment_id>/delete/', CommentDeleteView.as_view(), name='comment-delete'),
    # Документация
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]