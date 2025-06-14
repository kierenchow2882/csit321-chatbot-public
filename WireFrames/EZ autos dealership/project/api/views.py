from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Profile, ChatbotSettings, KnowledgeBase, VehicleInquiry, NewsletterSubscription
from .serializers import UserSerializer, ProfileSerializer, ChatbotSettingsSerializer, KnowledgeBaseSerializer
from .mongodb_models import (
    create_vehicle, get_vehicles, get_vehicle_by_id, update_vehicle, delete_vehicle,
    create_test_drive, get_test_drives, update_test_drive_status,
    save_chat_message, get_chat_history,
    save_feedback, get_feedback,
    create_team_member, get_team_members, update_team_member, delete_team_member,
    vehicles_collection, test_drives_collection, chat_history_collection,
    feedback_collection, team_members_collection
)
from bson import ObjectId
import json
from datetime import datetime, timedelta
from django.db.models import Count
from django.db.models.functions import TruncDate

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

# Analytics endpoint
@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_overview(request):
    try:
        # Get time range from query params (default to 30 days)
        days = int(request.GET.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        # Django database stats
        total_users = User.objects.count()
        new_users_count = User.objects.filter(date_joined__gte=start_date).count()
        total_inquiries = VehicleInquiry.objects.count()
        pending_inquiries = VehicleInquiry.objects.filter(status='pending').count()
        newsletter_subscribers = NewsletterSubscription.objects.filter(is_active=True).count()

        # User activity over time (last 7 days)
        user_activity = []
        for i in range(7):
            date = datetime.now() - timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            signups = User.objects.filter(date_joined__date=date.date()).count()
            user_activity.append({
                'date': date_str,
                'signups': signups,
                'visits': signups * 8  # Estimate visits based on signups
            })
        user_activity.reverse()

        # MongoDB stats
        mongodb_stats = {}

        if vehicles_collection is not None:
            total_vehicles = vehicles_collection.count_documents({})
            featured_vehicles = vehicles_collection.count_documents({"featured": True})
            available_vehicles = vehicles_collection.count_documents({"status": "available"})
            mongodb_stats.update({
                'total_vehicles': total_vehicles,
                'featured_vehicles': featured_vehicles,
                'available_vehicles': available_vehicles
            })

        if test_drives_collection is not None:
            total_test_drives = test_drives_collection.count_documents({})
            pending_test_drives = test_drives_collection.count_documents({"status": "pending"})
            approved_test_drives = test_drives_collection.count_documents({"status": "approved"})
            completed_test_drives = test_drives_collection.count_documents({"status": "completed"})
            mongodb_stats.update({
                'total_test_drives': total_test_drives,
                'pending_test_drives': pending_test_drives,
                'approved_test_drives': approved_test_drives,
                'completed_test_drives': completed_test_drives
            })

        if chat_history_collection is not None:
            total_chat_messages = chat_history_collection.count_documents({})
            user_messages = chat_history_collection.count_documents({"sender": "user"})
            bot_messages = chat_history_collection.count_documents({"sender": "bot"})

            # Chat interactions by category (simplified)
            chat_interactions = [
                {"name": "General Inquiries", "value": user_messages // 2},
                {"name": "Test Drive Requests", "value": user_messages // 4},
                {"name": "Financing Questions", "value": user_messages // 5},
                {"name": "Support", "value": user_messages // 8}
            ]

            mongodb_stats.update({
                'total_chat_messages': total_chat_messages,
                'user_messages': user_messages,
                'bot_messages': bot_messages,
                'chat_interactions': chat_interactions
            })

        if feedback_collection is not None:
            total_feedback = feedback_collection.count_documents({})

            # Average rating calculation
            feedback_cursor = feedback_collection.find({}, {"rating": 1})
            ratings = [doc.get('rating', 0) for doc in feedback_cursor]
            average_rating = sum(ratings) / len(ratings) if ratings else 0

            # Rating distribution
            rating_distribution = []
            for rating in range(1, 6):
                count = feedback_collection.count_documents({"rating": rating})
                rating_distribution.append({
                    "rating": rating,
                    "count": count
                })

            mongodb_stats.update({
                'total_feedback': total_feedback,
                'average_rating': round(average_rating, 2),
                'rating_distribution': rating_distribution
            })

        if team_members_collection is not None:
            total_team_members = team_members_collection.count_documents({})
            active_team_members = team_members_collection.count_documents({"status": "active"})
            mongodb_stats.update({
                'total_team_members': total_team_members,
                'active_team_members': active_team_members
            })

        # Calculate estimated revenue (simplified calculation)
        estimated_revenue = completed_test_drives * 45000 if 'completed_test_drives' in mongodb_stats else 0

        return Response({
            'overview_stats': {
                'total_users': total_users,
                'new_users': new_users_count,
                'total_test_drives': mongodb_stats.get('total_test_drives', 0),
                'total_chat_sessions': mongodb_stats.get('user_messages', 0),
                'estimated_revenue': estimated_revenue,
                'newsletter_subscribers': newsletter_subscribers,
                'pending_inquiries': pending_inquiries
            },
            'user_activity': user_activity,
            'mongodb_stats': mongodb_stats,
            'time_range': f"Last {days} days"
        })

    except Exception as e:
        print(f"Analytics error: {str(e)}")
        return Response({
            'error': 'Failed to fetch analytics data'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Vehicle endpoints
@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def vehicles_view(request):
    if request.method == 'GET':
        try:
            # Get query parameters for filtering
            make = request.GET.get('make')
            model = request.GET.get('model')
            year = request.GET.get('year')
            min_price = request.GET.get('min_price')
            max_price = request.GET.get('max_price')
            fuel_type = request.GET.get('fuel_type')
            featured = request.GET.get('featured')

            # Build filter query
            filters = {}
            if make:
                filters['make'] = {'$regex': make, '$options': 'i'}
            if model:
                filters['model'] = {'$regex': model, '$options': 'i'}
            if year:
                filters['year'] = int(year)
            if min_price or max_price:
                price_filter = {}
                if min_price:
                    price_filter['$gte'] = int(min_price)
                if max_price:
                    price_filter['$lte'] = int(max_price)
                filters['price'] = price_filter
            if fuel_type:
                filters['fuel_type'] = fuel_type
            if featured:
                filters['featured'] = featured.lower() == 'true'

            vehicles = get_vehicles(filters)

            # Convert ObjectId to string for JSON serialization
            for vehicle in vehicles:
                vehicle['id'] = str(vehicle['_id'])
                del vehicle['_id']

            return Response(vehicles)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        # Only admins can create vehicles
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role != 'admin':
                return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        except Profile.DoesNotExist:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        try:
            result = create_vehicle(request.data)
            return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.AllowAny])
def vehicle_detail_view(request, vehicle_id):
    if request.method == 'GET':
        try:
            vehicle = get_vehicle_by_id(vehicle_id)
            if not vehicle:
                return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

            vehicle['id'] = str(vehicle['_id'])
            del vehicle['_id']
            return Response(vehicle)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method in ['PUT', 'DELETE']:
        # Only admins can update/delete vehicles
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role != 'admin':
                return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        except Profile.DoesNotExist:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'PUT':
            try:
                result = update_vehicle(vehicle_id, request.data)
                if result.matched_count == 0:
                    return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
                return Response({'message': 'Vehicle updated successfully'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif request.method == 'DELETE':
            try:
                result = delete_vehicle(vehicle_id)
                if result.deleted_count == 0:
                    return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
                return Response({'message': 'Vehicle deleted successfully'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Test drive endpoints
@api_view(['GET', 'POST'])
def test_drive_view(request):
    if request.method == 'GET':
        # Admins can see all test drives, users can see their own
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role == 'admin':
                test_drives = get_test_drives()
            else:
                test_drives = get_test_drives({'user_id': str(request.user.id)})

            # Convert ObjectId to string for JSON serialization
            for drive in test_drives:
                drive['id'] = str(drive['_id'])
                del drive['_id']
            return Response(test_drives)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            data = request.data.copy()
            data['user_id'] = str(request.user.id)
            result = create_test_drive(data)
            return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_test_drive_view(request, test_drive_id):
    try:
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

        result = update_test_drive_status(test_drive_id, new_status)
        if result.matched_count == 0:
            return Response({'error': 'Test drive not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Test drive updated successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Chat history endpoints
@api_view(['GET', 'POST'])
def chat_history_view(request):
    if request.method == 'GET':
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role == 'admin':
                chat_history = get_chat_history()
            else:
                chat_history = get_chat_history({'user_id': str(request.user.id)})

            # Convert ObjectId to string for JSON serialization
            for message in chat_history:
                message['id'] = str(message['_id'])
                del message['_id']
            return Response(chat_history)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            data = request.data.copy()
            if request.user.is_authenticated:
                data['user_id'] = str(request.user.id)
            result = save_chat_message(data)
            return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Feedback endpoints
@api_view(['GET', 'POST'])
def feedback_view(request):
    if request.method == 'GET':
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role == 'admin':
                feedback = get_feedback()
            else:
                feedback = get_feedback({'user_id': str(request.user.id)})

            # Convert ObjectId to string for JSON serialization
            for item in feedback:
                item['id'] = str(item['_id'])
                del item['_id']
            return Response(feedback)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            data = request.data.copy()
            if request.user.is_authenticated:
                data['user_id'] = str(request.user.id)
            result = save_feedback(data)
            return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Team members endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def team_members_view(request):
    if request.method == 'GET':
        try:
            team_members = get_team_members()
            # Convert ObjectId to string for JSON serialization
            for member in team_members:
                member['id'] = str(member['_id'])
                del member['_id']
            return Response(team_members)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            result = create_team_member(request.data)
            return Response({'id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def team_member_detail_view(request, member_id):
    if request.method == 'PUT':
        try:
            result = update_team_member(member_id, request.data)
            if result.matched_count == 0:
                return Response({'error': 'Team member not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'message': 'Team member updated successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        try:
            result = delete_team_member(member_id)
            if result.deleted_count == 0:
                return Response({'error': 'Team member not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'message': 'Team member deleted successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Chat bot endpoint
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def chat_bot_view(request):
    try:
        message = request.data.get('message', '')
        session_id = request.data.get('session_id', '')

        # Simple chatbot responses - you can integrate with AI services later
        responses = {
            'hello': 'Hello! How can I help you find your perfect vehicle today?',
            'price': 'Our vehicles range from $25,000 to $150,000. Would you like to see vehicles in a specific price range?',
            'financing': 'We offer competitive financing options with rates starting at 2.9% APR. Would you like to speak with our finance team?',
            'test drive': 'I can help you schedule a test drive! Which vehicle are you interested in?',
            'hours': 'We are open Monday-Friday 9AM-8PM, Saturday 10AM-6PM, and Sunday 11AM-5PM.',
            'location': 'We are located at 123 Auto Boulevard, Car City. Would you like directions?',
            'default': 'Thank you for your question! Our team will get back to you shortly. Is there anything else I can help you with?'
        }

        # Simple keyword matching
        message_lower = message.lower()
        response = responses['default']

        for keyword, reply in responses.items():
            if keyword in message_lower:
                response = reply
                break

        # Save the conversation
        if request.user.is_authenticated:
            save_chat_message({
                'user_id': str(request.user.id),
                'session_id': session_id,
                'message': message,
                'sender': 'user'
            })

            save_chat_message({
                'user_id': str(request.user.id),
                'session_id': session_id,
                'message': response,
                'sender': 'bot'
            })

        return Response({'response': response})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)