"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicPath) {
      // Not logged in, trying to access private page -> go to login
      router.replace("/login");
    } else if (user && isPublicPath) {
      // Logged in, trying to access login/register -> go to dashboard
      router.replace("/dashboard");
    }
  }, [user, loading, isPublicPath, router]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#1a1f2e", color: "#fff",
        fontFamily: "var(--font-body)", gap: 16
      }}>
        {/* Loading Spinner */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(255, 255, 255, 0.1)",
          borderTopColor: "var(--brand)",
          animation: "spin 1s linear infinite"
        }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: "0.05em" }}>
          Initializing Session...
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  // Prevent flash of private content if not logged in
  if (!user && !isPublicPath) {
    return null;
  }

  // Prevent flash of login/register if already logged in
  if (user && isPublicPath) {
    return null;
  }

  return children;
}
