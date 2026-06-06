# FinSight Invoice OCR

FinSight is a receipt and invoice tracking app with a Next.js frontend and a Django REST backend. It supports authentication, receipt history search/filtering, dashboard summary endpoints, and a mock receipt processing flow used by the current UI.

## Project Structure

```text
.
+-- Backend/              # Django REST API
+-- frontend/             # Next.js app
+-- architecture_walkthrough.md
```

## Quick Start

Run the backend first:

```powershell
cd "D:\Side Project\Invoice OCR\invoice_detection"
Backend\venv\Scripts\python.exe Backend\manage.py runserver
```

Run the frontend in another terminal:

```powershell
cd "D:\Side Project\Invoice OCR\invoice_detection\frontend"
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend expects the API at:

```text
http://localhost:8000/api
```

## Documentation

- Backend setup and API details: [Backend/README.md](Backend/README.md)
- Frontend setup and scripts: [frontend/README.md](frontend/README.md)

## Useful Checks

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Backend:

```powershell
Backend\venv\Scripts\python.exe Backend\manage.py check
```

## Notes

- Receipt upload/result data is still partly mock/localStorage based in the frontend.
- Auth, receipt CRUD, search/filtering, categories, and dashboard summary endpoints are available in the backend.
- Do not commit `Backend/venv/` or local SQLite data if this repo is prepared for sharing.
