from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import views as auth_views

# Настроим схему документации API
schema_view = get_schema_view(
    openapi.Info(
        title="Video Platform API",
        default_version='v1',
        description="API for managing videos",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@videoplatform.local"),
        license=openapi.License(name="MIT"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/videos/', include('videos.urls')),  # Оставляем только один маршрут для видео
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('', lambda request: HttpResponseRedirect('/swagger/')),
    path('', lambda request: render(request, 'index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)