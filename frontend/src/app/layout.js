import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";

export const metadata = { title: "FinSight" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}