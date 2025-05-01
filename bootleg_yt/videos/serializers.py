from rest_framework import serializers
from .models import Video, Comment, Rating

class VideoSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'file_url', 'created_at', 'is_owner']
        extra_kwargs = {
            'file': {'required': False}
        }
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        return request and request.user == obj.user

    def update(self, instance, validated_data):
        # Логируем данные, которые приходят
        print(f"Обновление видео {instance.id}: validated_data={validated_data}")
        new_file = validated_data.get('file')
        if new_file and instance.file:
            instance.file.delete()
        return super().update(instance, validated_data)

    def validate(self, data):
        # Логируем ошибки валидации
        print(f"Валидация данных: {data}")
        return data

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'video', 'user', 'text', 'created_at', 'is_owner']
        read_only_fields = ['user', 'created_at', 'video']

    def get_is_owner(self, obj):
        request = self.context.get('request')
        print(f"Checking is_owner for comment {obj.id}, user: {request.user if request else 'None'}")  # Debug log
        return request and hasattr(request, 'user') and request.user.is_authenticated and request.user == obj.user

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Rating
        fields = ['id', 'video', 'user', 'rating', 'created_at']
        read_only_fields = ['user', 'created_at']
        
    def validate(self, data):
        if self.instance and self.instance.user != self.context['request'].user:
            raise serializers.ValidationError("Вы не можете изменять это видео")
        return data