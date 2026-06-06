"""
URL patterns for the receipts app.

Endpoints:
  /api/health/                        → Health check
  /api/receipts/                      → Receipt list / create
  /api/receipts/:id/                  → Receipt detail / update / delete
  /api/categories/                    → Category list / create
  /api/categories/:id/                → Category detail / update / delete
  /api/dashboard/stats/               → KPI cards
  /api/dashboard/category-breakdown/  → Category spending breakdown
  /api/dashboard/monthly-trend/       → Monthly spending trend
  /api/dashboard/summary/             → Month summary
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .auth_views import RegisterView, UserProfileView

router = DefaultRouter()
router.register(r"receipts", views.ReceiptViewSet, basename="receipt")
router.register(r"categories", views.CategoryViewSet, basename="category")

urlpatterns = [
    # Health check
    path("health/", views.health_check, name="health-check"),

    # Authentication
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("auth/me/", UserProfileView.as_view(), name="auth-me"),

    # Dashboard endpoints
    path("dashboard/stats/", views.dashboard_stats, name="dashboard-stats"),
    path("dashboard/category-breakdown/", views.category_breakdown, name="category-breakdown"),
    path("dashboard/monthly-trend/", views.monthly_trend, name="monthly-trend"),
    path("dashboard/summary/", views.dashboard_summary, name="dashboard-summary"),

    # DRF Router (receipts + categories CRUD)
    path("", include(router.urls)),
]
