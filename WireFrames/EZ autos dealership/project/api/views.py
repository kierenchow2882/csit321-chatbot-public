from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
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
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=email).exists():
            return Response({
                'error': 'Email already registered'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        
        Profile.objects.create(user=user, role='user')
        
        login(request, user)
        
        return Response({
            'message': 'User registered successfully',
            'email': user.email,
            'role': 'user'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return Response({
            'error': 'An error occurred during registration'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=email, password=password)
        
        if user is not None:
            login(request, user)
            try:
                profile = Profile.objects.get(user=user)
                return Response({
                    'email': user.email,
                    'role': profile.role,
                    'user_id': user.id
                })
            except Profile.DoesNotExist:
                profile = Profile.objects.create(user=user, role='user')
                return Response({
                    'email': user.email,
                    'role': profile.role,
                    'user_id': user.id
                })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return Response({
            'error': 'An error occurred during login'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
def get_profile(request):
    print(f"Profile request - User authenticated: {request.user.is_authenticated}")
    print(f"Profile request - User: {request.user}")
    
    if not request.user.is_authenticated:
        return Response({
            'error': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        profile = Profile.objects.get(user=request.user)
        return Response({
            'user': {
                'email': request.user.email,
                'id': request.user.id
            },
            'role': profile.role
        })
    except Profile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = Profile.objects.create(user=request.user, role='user')
        return Response({
            'user': {
                'email': request.user.email,
                'id': request.user.id
            },
            'role': profile.role
        })
    except Exception as e:
        print(f"Profile error: {str(e)}")
        return Response({
            'error': 'An error occurred while fetching profile'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            profile = Profile.objects.get(user=request.user)
            return profile.role == 'admin'
        except Profile.DoesNotExist:
            return False

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
        if not test_drives_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        test_drives = list(test_drives_collection.find())
        # Convert ObjectId to string for JSON serialization
        for drive in test_drives:
            drive['_id'] = str(drive['_id'])
        return Response(test_drives)
    elif request.method == 'POST':
        if not test_drives_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        result = create_test_drive(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def chat_history_view(request):
    if request.method == 'GET':
        if not chat_history_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        chat_history = list(chat_history_collection.find())
        # Convert ObjectId to string for JSON serialization
        for message in chat_history:
            message['_id'] = str(message['_id'])
        return Response(chat_history)
    elif request.method == 'POST':
        if not chat_history_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        result = save_chat_message(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def feedback_view(request):
    if request.method == 'GET':
        if not feedback_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        feedback = list(feedback_collection.find())
        # Convert ObjectId to string for JSON serialization
        for item in feedback:
            item['_id'] = str(item['_id'])
        return Response(feedback)
    elif request.method == 'POST':
        if not feedback_collection:
            return Response({'error': 'Database connection not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        result = save_feedback(request.data)
        return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

# Add team members endpoints for admin functionality
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def team_members_view(request):
    if request.method == 'GET':
        # Return sample team members data
        team_members = [
            {
                'id': '1',
                'name': 'John Doe',
                'email': 'john@ezautos.com',
                'role': 'Sales Manager',
                'department': 'Sales',
                'status': 'active'
            },
            {
                'id': '2',
                'name': 'Jane Smith',
                'email': 'jane@ezautos.com',
                'role': 'Service Advisor',
                'department': 'Service',
                'status': 'active'
            }
        ]
        return Response(team_members)
    elif request.method == 'POST':
        # In a real implementation, you would save to database
        return Response({'id': 'new_member_id'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_team_member(request, member_id):
    # In a real implementation, you would delete from database
    return Response({'message': 'Team member deleted'}, status=status.HTTP_204_NO_CONTENT)