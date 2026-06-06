# FinSight Frontend

Next.js frontend for the FinSight receipt tracking app.

## Setup

From the frontend folder:

```powershell
cd "D:\Side Project\Invoice OCR\invoice_detection\frontend"
npm install
```

## Run Development Server

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend API helper points to:

```text
http://localhost:8000/api
```

Start the Django backend before using authenticated pages or receipt search.

## Scripts

```powershell
npm run dev
npm run lint
npm run build
npm run start
```

## Main App Routes

```text
/login
/register
/dashboard
/upload
/result
/history
/reports
/profile
/settings
/help
```

## Current Notes

- Authentication uses JWT tokens stored in `localStorage`.
- History search calls the backend receipt API with `?search=`.
- Dashboard Add User calls `POST /api/auth/register/`.
- Result page export, print, and share actions run in the browser.
- Upload/result receipt processing is still mock/localStorage based.
