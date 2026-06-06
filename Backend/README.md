# FinSight Backend

Django REST API for authentication, receipt data, categories, and dashboard summary data.

## Requirements

- Python 3.12
- Django 5.2
- Django REST Framework
- Simple JWT
- django-filter
- Pillow

Dependencies are listed in [requirements.txt](requirements.txt).

## Setup

From the project root:

```powershell
cd "D:\Side Project\Invoice OCR\invoice_detection"
Backend\venv\Scripts\python.exe -m pip install -r Backend\requirements.txt
Backend\venv\Scripts\python.exe Backend\manage.py migrate
```

Run the API server:

```powershell
Backend\venv\Scripts\python.exe Backend\manage.py runserver
```

API base URL:

```text
http://localhost:8000/api
```

## Health Check

```text
GET /api/health/
```

## Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
PUT  /api/auth/me/
```

Most endpoints require a JWT access token:

```text
Authorization: Bearer <access-token>
```

## Receipts

```text
GET    /api/receipts/
POST   /api/receipts/
GET    /api/receipts/{id}/
PUT    /api/receipts/{id}/
PATCH  /api/receipts/{id}/
DELETE /api/receipts/{id}/
```

Receipt list supports:

```text
?search=
?status=
?category=
?date_after=
?date_before=
?amount_min=
?amount_max=
?ordering=
?page=
```

Search checks merchant, category name, location, and payment.

## Categories

```text
GET    /api/categories/
POST   /api/categories/
GET    /api/categories/{id}/
PUT    /api/categories/{id}/
PATCH  /api/categories/{id}/
DELETE /api/categories/{id}/
```

## Dashboard

```text
GET /api/dashboard/stats/
GET /api/dashboard/category-breakdown/
GET /api/dashboard/monthly-trend/
GET /api/dashboard/summary/
```

## Checks

```powershell
Backend\venv\Scripts\python.exe Backend\manage.py check
```

## Development Notes

- SQLite is used for local development at `Backend/db.sqlite3`.
- Uploaded media is served from `Backend/media/`.
- The frontend currently uses some mock/localStorage receipt data for upload results.
