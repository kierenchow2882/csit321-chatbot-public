from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Profile, ChatbotSettings, KnowledgeBase
from .serializers import UserSerializer, ProfileSerializer, ChatbotSettingsSerializer, KnowledgeBaseSerializer
from .mongodb_models import (
    create_test_drive,
    save_chat_message,
    save_feedback,
    test_drives_collection,
    chat_history_collection,
    feedback_collection
)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'message': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({
                'message': 'Email already registered'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user with email as username
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Create associated profile
        Profile.objects.create(user=user, role='user')

        return Response({
            'message': 'User registered successfully',
            'email': user.email
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Registration error: {str(e)}")  # For debugging
        return Response({
            'message': 'An error occurred during registration',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is not None:
        login(request, user)
        return Response({
            'email': user.email,
            'role': user.profile.role
        })

    return Response({
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
def get_profile(request):
    if not request.user.is_authenticated:
        return Response({
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'user': {
            'email': request.user.email,
            'id': request.user.id
        },
        'role': request.user.profile.role
    })

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == 'admin'

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminUser]

class ChatbotSettingsViewSet(viewsets.ModelViewSet):
    queryset = ChatbotSettings.objects.all()
    serializer_class = ChatbotSettingsSerializer
    permission_classes = [IsAdminUser]

class KnowledgeBaseViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBase.objects.all()
    serializer_class = KnowledgeBaseSerializer
    permission_classes = [IsAdminUser]

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def test_drive_view(request):
    if request.method == 'GET':
        test_drives = list(test_drives_collection.find())
        return Response(test_drives)
    elif request.method == 'POST':
        result = create_test_drive(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def chat_history_view(request):
    if request.method == 'GET':
        chat_history = list(chat_history_collection.find())
        return Response(chat_history)
    elif request.method == 'POST':
        result = save_chat_message(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def feedback_view(request):
    if request.method == 'GET':
        feedback = list(feedback_collection.find())
        return Response(feedback)
    elif request.method == 'POST':
        result = save_feedback(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)