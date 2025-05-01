from django.db import models
from django.conf import settings
import os
from django.core.files.storage import FileSystemStorage

# Кастомное хранилище для контроля разрешений
class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        # Удаляем существующий файл с тем же именем
        if self.exists(name):
            self.delete(name)
        return name

def video_upload_path(instance, filename):
    # Путь для сохранения: media/videos/user_<id>/<filename>
    return os.path.join('videos', f'user_{instance.user.id}', filename)

class Video(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='videos'
    )
    title = models.CharField(
        max_length=255,
        verbose_name='Название видео'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Описание'
    )
    file = models.FileField(
        upload_to=video_upload_path,
        storage=OverwriteStorage(),
        verbose_name='Видеофайл',
        help_text='Поддерживаемые форматы: mp4, webm, mov'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    preview = models.ImageField(
        upload_to='video_previews/',
        blank=True,
        null=True,
        verbose_name='Превью'
    )

    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} (пользователь: {self.user.username})'

    def filename(self):
        return os.path.basename(self.file.name)

    def get_absolute_url(self):
        return f'/videos/{self.id}/'

    def save(self, *args, **kwargs):
        # Логирование пути при сохранении
        if self.file:
            print(f"Файл будет сохранен в: {self.file.path}")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Удаляем файл при удалении объекта
        if self.file:
            storage, path = self.file.storage, self.file.path
            super().delete(*args, **kwargs)
            storage.delete(path)
        else:
            super().delete(*args, **kwargs)


class Comment(models.Model):
    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    text = models.TextField(verbose_name='Текст комментария')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Комментарий от {self.user.username} к видео {self.video.id}'


class Rating(models.Model):
    RATING_CHOICES = [
        (1, '1 - Ужасно'),
        (2, '2 - Плохо'),
        (3, '3 - Нормально'),
        (4, '4 - Хорошо'),
        (5, '5 - Отлично'),
    ]
    
    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['video', 'user']  # Один пользователь - одна оценка
        ordering = ['-created_at']

    def __str__(self):
        return f'Оценка {self.rating} от {self.user.username}'