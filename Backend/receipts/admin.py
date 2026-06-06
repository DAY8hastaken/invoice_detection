"""
Django Admin configuration for receipt models.
"""

from django.contrib import admin
from .models import Category, Receipt, LineItem


class LineItemInline(admin.TabularInline):
    """Show line items inline within the Receipt admin page."""

    model = LineItem
    extra = 1
    fields = ["description", "quantity", "unit_price"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["emoji", "name", "color", "receipt_count"]
    search_fields = ["name"]

    @admin.display(description="Receipts")
    def receipt_count(self, obj):
        return obj.receipts.count()


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = [
        "merchant",
        "amount",
        "currency",
        "date",
        "category",
        "status",
        "confidence",
        "created_at",
    ]
    list_filter = ["status", "category", "currency", "date"]
    search_fields = ["merchant", "location", "payment"]
    date_hierarchy = "date"
    readonly_fields = ["created_at", "updated_at"]
    inlines = [LineItemInline]

    fieldsets = (
        (
            "Receipt Details",
            {
                "fields": (
                    "merchant",
                    "amount",
                    "currency",
                    "tax",
                    "date",
                    "category",
                    "status",
                )
            },
        ),
        (
            "OCR & Payment",
            {
                "fields": ("confidence", "payment", "location"),
                "classes": ("collapse",),
            },
        ),
        (
            "File",
            {
                "fields": ("image",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(LineItem)
class LineItemAdmin(admin.ModelAdmin):
    list_display = ["description", "quantity", "unit_price", "receipt"]
    list_filter = ["receipt__merchant"]
    search_fields = ["description"]
