"""
Management command to seed the database with sample receipt data.

Mirrors the mock data from the frontend's mockData.js so the API
returns realistic data when the frontend is wired up.

Usage:
    python manage.py seed_data
    python manage.py seed_data --clear   # Clear existing data first
"""

import random
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from receipts.models import Category, Receipt, LineItem


# Sample data matching mockData.js
SAMPLE_RECEIPTS = [
    {"merchant": "Whole Foods", "emoji": "🛒", "amount": 84.37, "category": "Groceries", "status": "processed"},
    {"merchant": "Uber Eats", "emoji": "🍔", "amount": 32.50, "category": "Dining", "status": "processed"},
    {"merchant": "AWS", "emoji": "☁️", "amount": 219.00, "category": "Software", "status": "processed"},
    {"merchant": "Delta Airlines", "emoji": "✈️", "amount": 486.00, "category": "Travel", "status": "pending"},
    {"merchant": "Shell Gas", "emoji": "⛽", "amount": 67.80, "category": "Transport", "status": "processed"},
    {"merchant": "Apple Store", "emoji": "🍎", "amount": 129.99, "category": "Electronics", "status": "failed"},
    {"merchant": "WeWork", "emoji": "🏢", "amount": 350.00, "category": "Office", "status": "processed"},
    {"merchant": "Marriott", "emoji": "🏨", "amount": 293.00, "category": "Travel", "status": "pending"},
]

MERCHANTS = [
    "Whole Foods Market", "Target", "Walmart", "Best Buy", "Trader Joe's",
    "Costco", "Starbucks", "Amazon", "Home Depot", "Walgreens",
    "CVS Pharmacy", "McDonald's", "Uber Eats", "Grubhub", "Shell Gas",
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Los Angeles, CA",
    "Chicago, IL", "Boston, MA", "Seattle, WA",
    "Austin, TX", "Denver, CO", "Portland, OR",
]

ITEM_NAMES = [
    "Organic Milk", "Bread Whole Wheat", "Fresh Salmon", "Avocados (3pk)",
    "Coffee Beans", "Paper Towels", "Dish Soap", "Chicken Breast",
    "Mixed Salad", "Sparkling Water", "Olive Oil", "Pasta Sauce",
    "Bananas", "Eggs (dozen)", "Cheese Block", "Orange Juice",
]


class Command(BaseCommand):
    help = "Seed database with sample receipt data matching the frontend mockData.js"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing receipts and line items before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            LineItem.objects.all().delete()
            Receipt.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing receipts and line items."))

        # Ensure default test user exists
        user, created = User.objects.get_or_create(
            username="jane",
            defaults={"email": "jane@acmecorp.io"}
        )
        # Always ensure jane has the test password
        user.set_password("test1234")
        user.save()
        self.stdout.write(self.style.SUCCESS("Test user 'jane' is active with password 'test1234'."))

        # Ensure categories exist
        categories = {}
        for cat_name in ["Groceries", "Travel", "Dining", "Software", "Electronics", "Transport", "Office", "Clothing"]:
            cat, _ = Category.objects.get_or_create(name=cat_name)
            categories[cat_name] = cat

        today = date.today()
        created_count = 0

        # Create the 8 receipts from mockData.js (recent dates)
        for i, data in enumerate(SAMPLE_RECEIPTS):
            receipt_date = today - timedelta(days=i + 1)
            category = categories.get(data["category"])

            receipt = Receipt.objects.create(
                user=user,
                merchant=data["merchant"],
                amount=Decimal(str(data["amount"])),
                currency="USD",
                tax=Decimal(str(round(data["amount"] * 0.08, 2))),
                date=receipt_date,
                category=category,
                status=data["status"],
                confidence=round(random.uniform(92, 99.5), 1),
                payment=f"Visa ····{random.randint(1000, 9999)}",
                location=random.choice(LOCATIONS),
            )

            # Add line items
            num_items = random.randint(2, 5)
            remaining = float(data["amount"])
            for j in range(num_items):
                item_name = random.choice(ITEM_NAMES)
                if j < num_items - 1:
                    price = round(random.uniform(3, remaining / 2), 2)
                    remaining -= price
                else:
                    price = round(remaining, 2)

                LineItem.objects.create(
                    receipt=receipt,
                    description=item_name,
                    quantity=1,
                    unit_price=Decimal(str(max(price, 0.01))),
                )

            created_count += 1

        # Create additional receipts spread across previous months
        for month_offset in range(1, 7):
            num_receipts = random.randint(3, 6)
            for _ in range(num_receipts):
                days_ago = month_offset * 30 + random.randint(0, 29)
                receipt_date = today - timedelta(days=days_ago)
                merchant = random.choice(MERCHANTS)
                category = random.choice(list(categories.values()))
                amount = round(random.uniform(10, 500), 2)

                receipt = Receipt.objects.create(
                    user=user,
                    merchant=merchant,
                    amount=Decimal(str(amount)),
                    currency="USD",
                    tax=Decimal(str(round(amount * 0.08, 2))),
                    date=receipt_date,
                    category=category,
                    status=random.choice(["processed", "processed", "processed", "pending"]),
                    confidence=round(random.uniform(88, 99.5), 1),
                    payment=f"Visa ····{random.randint(1000, 9999)}",
                    location=random.choice(LOCATIONS),
                )

                # Add line items
                num_items = random.randint(1, 4)
                remaining = amount
                for j in range(num_items):
                    item_name = random.choice(ITEM_NAMES)
                    if j < num_items - 1:
                        price = round(random.uniform(3, remaining / 2), 2)
                        remaining -= price
                    else:
                        price = round(remaining, 2)

                    LineItem.objects.create(
                        receipt=receipt,
                        description=item_name,
                        quantity=random.randint(1, 3),
                        unit_price=Decimal(str(max(price, 0.01))),
                    )

                created_count += 1

        total_items = LineItem.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {created_count} receipts with {total_items} line items across 7 months."
            )
        )
