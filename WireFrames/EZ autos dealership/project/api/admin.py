from django.contrib import admin
from .models import Profile, ChatbotSettings, KnowledgeBase

admin.site.register(Profile)
admin.site.register(ChatbotSettings)
admin.site.register(KnowledgeBase)