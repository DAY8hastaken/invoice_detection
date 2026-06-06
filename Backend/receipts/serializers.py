"""
DRF Serializers for the receipts app.

These serializers match the JSON shapes the frontend currently expects
from mockData.js and generateMockReceipt().
"""

from rest_framework import serializers
from .models import Category, Receipt, LineItem


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    receipt_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Category
        fields = ["id", "name", "emoji", "color", "receipt_count"]


class LineItemSerializer(serializers.ModelSerializer):
    """
    Serializer for LineItem model.
    Maps to receipt.items[] shape: { name, price }
    """

    # Frontend uses "name" and "price", our model uses "description" and "unit_price"
    name = serializers.CharField(source="description")
    price = serializers.DecimalField(
        source="unit_price", max_digits=10, decimal_places=2
    )

    class Meta:
        model = LineItem
        fields = ["id", "name", "quantity", "price"]


class ReceiptListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for receipt list views (history page).
    Matches the RECEIPTS[] shape in mockData.js:
    { id, merchant, emoji, amount, date, category, status }
    """

    emoji = serializers.CharField(source="category.emoji", read_only=True, default="📁")
    category = serializers.CharField(source="category.name", read_only=True, default="Uncategorized")

    class Meta:
        model = Receipt
        fields = [
            "id",
            "merchant",
            "emoji",
            "amount",
            "currency",
            "date",
            "category",
            "status",
        ]


class ReceiptDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for single receipt view (result page).
    Matches the generateMockReceipt() output shape:
    { id, merchant, amount, currency, date, category, tax, payment, location,
      confidence, fileName, items: [{ name, price }] }
    """

    items = LineItemSerializer(many=True, read_only=True)
    emoji = serializers.CharField(source="category.emoji", read_only=True, default="📁")
    category = serializers.CharField(source="category.name", read_only=True, default="Uncategorized")
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Receipt
        fields = [
            "id",
            "merchant",
            "emoji",
            "amount",
            "currency",
            "tax",
            "date",
            "category",
            "category_id",
            "status",
            "confidence",
            "payment",
            "location",
            "image",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ReceiptCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating receipts (upload flow).
    Accepts nested line items for creation.
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    items = LineItemSerializer(many=True, required=False)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Receipt
        fields = [
            "user",
            "merchant",
            "amount",
            "currency",
            "tax",
            "date",
            "category_id",
            "status",
            "confidence",
            "payment",
            "location",
            "image",
            "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        receipt = Receipt.objects.create(**validated_data)
        for item_data in items_data:
            LineItem.objects.create(receipt=receipt, **item_data)
        return receipt


# ─── Dashboard-specific serializers ───────────────────────────────

class DashboardStatSerializer(serializers.Serializer):
    """
    Matches STATS[] shape in mockData.js:
    { id, label, value, delta, trend, icon, color, bgColor, sparkline }
    """

    id = serializers.CharField()
    label = serializers.CharField()
    value = serializers.CharField()
    delta = serializers.CharField()
    trend = serializers.CharField()
    icon = serializers.CharField()
    color = serializers.CharField()
    bgColor = serializers.CharField()
    sparkline = serializers.ListField(child=serializers.FloatField())


class CategoryBreakdownSerializer(serializers.Serializer):
    """
    Matches CATEGORY_BREAKDOWN[] shape in mockData.js:
    { name, amount, pct, color }
    """

    name = serializers.CharField()
    amount = serializers.FloatField()
    pct = serializers.IntegerField()
    color = serializers.CharField()


class MonthlyTrendSerializer(serializers.Serializer):
    """
    Matches MONTHLY_TREND[] shape in mockData.js:
    { month, val }
    """

    month = serializers.CharField()
    val = serializers.FloatField()
