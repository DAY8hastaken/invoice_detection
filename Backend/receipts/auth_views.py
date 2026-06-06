"""
Authentication views for FinSight receipts app.
"""

from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    """
    Handles classic registration: username, email, password, confirm_password.
    Returns JWT tokens immediately upon successful registration.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        # Basic validations
        if not all([username, email, password, confirm_password]):
            return Response(
                {"error": "Please provide username, email, password, and confirm password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != confirm_password:
            return Response(
                {"error": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {"error": "Password must be at least 6 characters long."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email is already registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            user.save()

            # Generate tokens immediately
            refresh = RefreshToken.for_user(user)

            return Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"An error occurred while creating user: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserProfileView(APIView):
    """
    Retrieves or updates the current user's profile details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        receipts_count = user.receipts.count()
        total_spent = user.receipts.aggregate(total=Sum("amount"))["total"] or 0

        # We can format joinDate in a nice readable format (e.g. Month Year)
        join_date = user.date_joined.strftime("%B %d, %Y")

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.username,  # default to username
            "company": "Acme Corporation",
            "phone": "",
            "role": "Finance Member",
            "location": "",
            "joinDate": join_date,
            "receiptsProcessed": receipts_count,
            "totalSpent": float(total_spent),
        })

    def put(self, request):
        user = request.user
        username = request.data.get("username", user.username)
        email = request.data.get("email", user.email)

        # Validate unique username
        if username != user.username and User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate unique email
        if email != user.email and User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email is already registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.username = username
        user.email = email
        user.save()

        return Response({
            "message": "Profile updated successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })
