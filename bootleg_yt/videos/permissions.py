from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """
    Разрешение, которое позволяет доступ только владельцу объекта (в данном случае — видео).
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user  # Проверяем, что видео принадлежит текущему пользователю
