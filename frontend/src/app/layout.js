// app/layout.js — root layout (minimal, just font + css)
import "./globals.css";
export const metadata = { title: "FinSight" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}