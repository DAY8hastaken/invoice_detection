"""
Views for the receipts app.

Step 4: Secure all views to filter by request.user.
"""

from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Sum, Count, Avg, Max, F, Q
from django.http import JsonResponse
from django_filters import rest_framework as django_filters
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Category, Receipt, LineItem
from .serializers import (
    CategorySerializer,
    ReceiptListSerializer,
    ReceiptDetailSerializer,
    ReceiptCreateSerializer,
)


# ─── Health Check ─────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([permissions.AllowAny])  # Keep health check public
def health_check(request):
    """
    Simple health-check endpoint.
    GET /api/health/ → {"status": "ok", "service": "finsight-backend"}
    """
    return JsonResponse({
        "status": "ok",
        "service": "finsight-backend",
        "version": "0.1.0",
    })


# ─── Category ViewSet ────────────────────────────────────────────

class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for expense categories. Only lists receipt counts for the request.user.
    """
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.annotate(
            receipt_count=Count("receipts", filter=Q(receipts__user=self.request.user))
        ).all()


# ─── Receipt Filter ──────────────────────────────────────────────

class ReceiptFilter(django_filters.FilterSet):
    """
    FilterSet for receipts. Supports:
      ?status=processed
      ?category=Groceries     (category name)
      ?date_after=2025-01-01
      ?date_before=2025-12-31
      ?amount_min=10
      ?amount_max=500
    """
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="iexact"
    )
    date_after = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    date_before = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    amount_min = django_filters.NumberFilter(field_name="amount", lookup_expr="gte")
    amount_max = django_filters.NumberFilter(field_name="amount", lookup_expr="lte")

    class Meta:
        model = Receipt
        fields = ["status"]


class ReceiptSearchPagination(PageNumberPagination):
    """Paginated receipt response with the active search/filter context."""

    def get_paginated_response(self, data):
        request = self.request
        query_params = request.query_params
        excluded_params = {"page", "search", "ordering"}
        filters = {
            key: value
            for key, value in query_params.items()
            if key not in excluded_params and value != ""
        }

        return Response({
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "page": self.page.number,
            "page_size": self.get_page_size(request),
            "total_pages": self.page.paginator.num_pages,
            "search": query_params.get("search", ""),
            "ordering": query_params.get("ordering", ""),
            "filters": filters,
            "results": data,
        })


# ─── Receipt ViewSet ─────────────────────────────────────────────

class ReceiptViewSet(viewsets.ModelViewSet):
    """
    CRUD for receipts. Restricts all actions to receipts owned by the authenticated user.

    Supports:
      ?search=         → merchant, category name, location, payment
      ?status=         → exact status filter
      ?category=       → category name (case-insensitive)
      ?date_after=     → receipts on or after date
      ?date_before=    → receipts on or before date
      ?ordering=       → date, -date, amount, -amount, merchant
      ?page=           → pagination
    """
    pagination_class = ReceiptSearchPagination
    filterset_class = ReceiptFilter
    search_fields = ["merchant", "category__name", "location", "payment"]
    ordering_fields = ["date", "amount", "merchant", "created_at"]
    ordering = ["-date", "-created_at"]

    def get_queryset(self):
        return Receipt.objects.filter(user=self.request.user).select_related("category").prefetch_related("items")

    def get_serializer_class(self):
        if self.action == "list":
            return ReceiptListSerializer
        if self.action == "create":
            return ReceiptCreateSerializer
        return ReceiptDetailSerializer


# ─── Dashboard Stats ─────────────────────────────────────────────

@api_view(["GET"])
def dashboard_stats(request):
    """
    GET /api/dashboard/stats/
    Returns KPI cards data matching the STATS[] shape in mockData.js (filtered by user)
    """
    receipts = Receipt.objects.filter(user=request.user)

    total_amount = receipts.aggregate(total=Sum("amount"))["total"] or Decimal("0")
    receipt_count = receipts.count()
    category_count = Category.objects.filter(receipts__user=request.user).distinct().count()
    avg_amount = receipts.aggregate(avg=Avg("amount"))["avg"] or Decimal("0")

    # Calculate deltas (compare current month vs previous month)
    today = date.today()
    first_of_month = today.replace(day=1)
    first_of_prev_month = (first_of_month - timedelta(days=1)).replace(day=1)

    current_month_total = receipts.filter(
        date__gte=first_of_month
    ).aggregate(total=Sum("amount"))["total"] or Decimal("0")

    prev_month_total = receipts.filter(
        date__gte=first_of_prev_month,
        date__lt=first_of_month,
    ).aggregate(total=Sum("amount"))["total"] or Decimal("0")

    if prev_month_total > 0:
        delta_pct = ((current_month_total - prev_month_total) / prev_month_total * 100)
        delta_str = f"+{delta_pct:.1f}%" if delta_pct >= 0 else f"{delta_pct:.1f}%"
        trend = "up" if delta_pct >= 0 else "down"
    else:
        delta_str = "+0%"
        trend = "up"

    current_month_count = receipts.filter(date__gte=first_of_month).count()
    prev_month_count = receipts.filter(
        date__gte=first_of_prev_month,
        date__lt=first_of_month,
    ).count()
    count_delta = current_month_count - prev_month_count

    # Build sparkline data (last 8 months of totals)
    sparkline_data = []
    for i in range(7, -1, -1):
        m_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
        if i > 0:
            m_end = (today.replace(day=1) - timedelta(days=30 * (i - 1))).replace(day=1)
        else:
            m_end = today + timedelta(days=1)
        month_total = receipts.filter(
            date__gte=m_start, date__lt=m_end
        ).aggregate(total=Sum("amount"))["total"] or 0
        sparkline_data.append(float(month_total))

    stats = [
        {
            "id": "total",
            "label": "Total Expenses",
            "value": f"${total_amount:,.0f}",
            "delta": delta_str,
            "trend": trend,
            "icon": "💰",
            "color": "#6366f1",
            "bgColor": "rgba(99,102,241,0.12)",
            "sparkline": sparkline_data,
        },
        {
            "id": "receipts",
            "label": "Receipts Processed",
            "value": str(receipt_count),
            "delta": f"+{count_delta}" if count_delta >= 0 else str(count_delta),
            "trend": "up" if count_delta >= 0 else "down",
            "icon": "🧾",
            "color": "#10b981",
            "bgColor": "rgba(16,185,129,0.12)",
            "sparkline": sparkline_data,
        },
        {
            "id": "categories",
            "label": "Active Categories",
            "value": str(category_count),
            "delta": f"+{category_count}",
            "trend": "up",
            "icon": "📂",
            "color": "#f59e0b",
            "bgColor": "rgba(245,158,11,0.12)",
            "sparkline": [float(category_count)] * 8,
        },
        {
            "id": "avg",
            "label": "Avg per Receipt",
            "value": f"${avg_amount:,.2f}",
            "delta": "-",
            "trend": "down",
            "icon": "📊",
            "color": "#38bdf8",
            "bgColor": "rgba(56,189,248,0.12)",
            "sparkline": sparkline_data,
        },
    ]

    return Response(stats)


# ─── Category Breakdown ──────────────────────────────────────────

@api_view(["GET"])
def category_breakdown(request):
    """
    GET /api/dashboard/category-breakdown/
    Returns category spending breakdown for the current user.
    """
    categories = (
        Category.objects
        .annotate(total_amount=Sum("receipts__amount", filter=Q(receipts__user=request.user)))
        .filter(total_amount__isnull=False)
        .order_by("-total_amount")
    )

    if not categories:
        return Response([])

    max_amount = categories.first().total_amount or Decimal("1")

    breakdown = []
    for cat in categories:
        amount = float(cat.total_amount or 0)
        pct = int((cat.total_amount / max_amount) * 100) if max_amount else 0
        breakdown.append({
            "name": cat.name,
            "amount": amount,
            "pct": pct,
            "color": cat.color,
        })

    return Response(breakdown)


# ─── Monthly Trend ───────────────────────────────────────────────

@api_view(["GET"])
def monthly_trend(request):
    """
    GET /api/dashboard/monthly-trend/
    Returns monthly spending data for the current user.
    """
    today = date.today()

    # Get the last 7 months
    trend = []
    for i in range(6, -1, -1):
        m_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
        if i > 0:
            m_end = (today.replace(day=1) - timedelta(days=30 * (i - 1))).replace(day=1)
        else:
            m_end = today + timedelta(days=1)

        month_total = Receipt.objects.filter(
            user=request.user,
            date__gte=m_start,
            date__lt=m_end
        ).aggregate(total=Sum("amount"))["total"] or 0

        trend.append({
            "month": m_start.strftime("%b"),
            "val": float(month_total),
        })

    return Response(trend)


# ─── Dashboard Summary ───────────────────────────────────────────

@api_view(["GET"])
def dashboard_summary(request):
    """
    GET /api/dashboard/summary/
    Returns the month summary data for the dashboard bottom panel (filtered by user).
    """
    today = date.today()
    first_of_month = today.replace(day=1)
    day_of_month = today.day

    month_receipts = Receipt.objects.filter(user=request.user, date__gte=first_of_month)
    agg = month_receipts.aggregate(
        total=Sum("amount"),
        count=Count("id"),
        largest=Max("amount"),
    )

    total = float(agg["total"] or 0)
    count = agg["count"] or 0
    largest = float(agg["largest"] or 0)
    avg_per_day = total / day_of_month if day_of_month > 0 else 0
    categories_used = (
        month_receipts
        .values("category")
        .distinct()
        .count()
    )

    return Response({
        "total_spent": f"${total:,.2f}",
        "receipts_processed": str(count),
        "avg_per_day": f"${avg_per_day:,.2f}",
        "largest_expense": f"${largest:,.2f}",
        "categories_used": str(categories_used),
    })
