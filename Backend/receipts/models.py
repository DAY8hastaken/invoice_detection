"""
Database models for FinSight receipts.

These models mirror the data shapes used by the frontend:
- Category  → CATEGORY_BREAKDOWN in mockData.js
- Receipt   → RECEIPTS in mockData.js + generateMockReceipt() output
- LineItem  → receipt.items[] from generateMockReceipt()
"""

from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    """
    Expense category (e.g. Groceries, Travel, Electronics).
    Maps to CATEGORY_BREAKDOWN in the frontend's mockData.js.
    """

    name = models.CharField(max_length=100, unique=True)
    emoji = models.CharField(max_length=10, blank=True, default="📁")
    color = models.CharField(
        max_length=7,
        default="#6366f1",
        help_text="Hex color for charts (e.g. #6366f1)",
    )

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return f"{self.emoji} {self.name}"


class Receipt(models.Model):
    """
    A scanned receipt / invoice.
    Maps to RECEIPTS[] in mockData.js and generateMockReceipt() output.
    """

    class Status(models.TextChoices):
        PROCESSED = "processed", "Processed"
        PENDING = "pending", "Pending"
        FAILED = "failed", "Failed"

    # Core fields
    merchant = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="USD")
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateField()

    # Classification
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipts",
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )

    # OCR metadata
    confidence = models.FloatField(
        null=True,
        blank=True,
        help_text="OCR confidence percentage (0-100)",
    )

    # Payment & location
    payment = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text='e.g. "Visa ····1234"',
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text='e.g. "San Francisco, CA"',
    )

    # File
    image = models.ImageField(
        upload_to="receipts/%Y/%m/",
        null=True,
        blank=True,
        help_text="The uploaded receipt photo",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="receipts",
    )

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.merchant} — ${self.amount} ({self.get_status_display()})"


class LineItem(models.Model):
    """
    Individual line item on a receipt.
    Maps to receipt.items[] from generateMockReceipt().
    """

    receipt = models.ForeignKey(
        Receipt,
        on_delete=models.CASCADE,
        related_name="items",
    )
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.description} × {self.quantity} @ ${self.unit_price}"

    @property
    def total(self):
        return self.quantity * self.unit_price
