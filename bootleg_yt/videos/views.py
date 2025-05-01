from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Video, Comment
from .serializers import VideoSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from .permissions import IsOwner
from rest_framework.parsers import MultiPartParser, JSONParser

# Список всех видео
class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        print("Fetching videos")  # Debug log
        return super().get(request, *args, **kwargs)

# Загрузка видео
class VideoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = VideoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# Получение одного видео
class VideoRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return get_object_or_404(Video, pk=self.kwargs['pk'])

# Обновление видео
class VideoUpdateAPIView(UpdateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwner]
    parser_classes = [MultiPartParser, JSONParser]

    def perform_update(self, serializer):
        # Убираем добавление user, так как он не должен меняться
        serializer.save()

# Удаление видео
class VideoDeleteAPIView(DestroyAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwner]

    def perform_destroy(self, instance):
        if instance.file:
            instance.file.delete()
        super().perform_destroy(instance)

# Новый view для комментариев
class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, video_id):
        video = get_object_or_404(Video, pk=video_id)
        comments = Comment.objects.filter(video=video)
        print(f"Fetching comments for video {video_id}")  # Debug log
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, video_id):
        video = get_object_or_404(Video, pk=video_id)
        print(f"Incoming comment data: {request.data}")  # Debug log
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user, video=video)
            return Response(serializer.data, status=201)
        print(f"Serializer errors: {serializer.errors}")  # Debug log
        return Response(serializer.errors, status=400)

# Новый view для удаления комментариев
class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, video_id, comment_id):
        print(f"Attempting to delete comment {comment_id} for video {video_id} by user {request.user}")  # Debug log
        comment = get_object_or_404(Comment, pk=comment_id, video__id=video_id)
        if comment.user != request.user:
            raise PermissionDenied("Вы можете удалять только свои комментарии")
        comment.delete()
        return Response({"message": "Комментарий удален"}, status=204)