from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ProfileViewSet, ChatbotSettingsViewSet,
    KnowledgeBaseViewSet, register_user, login_user, logout_user,
    get_profile, test_drive_view, chat_history_view, feedback_view
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'chatbot-settings', ChatbotSettingsViewSet)
router.register(r'knowledge-base', KnowledgeBaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('profiles/me/', get_profile, name='profile'),
    path('test-drives/', test_drive_view, name='test-drives'),
    path('chat-history/', chat_history_view, name='chat-history'),
    path('feedback/', feedback_view, name='feedback'),
]