"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const res = await login(username, password);
    if (!res.success) {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "radial-gradient(circle at 10% 20%, #0f172a 0%, #1e1b4b 100%)",
      fontFamily: "var(--font-body)", position: "relative", overflow: "hidden",
      padding: 24,
    }}>
      {/* Decorative Blur Blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "15%",
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(124, 58, 237, 0.15)", filter: "blur(80px)",
        zIndex: 1, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "15%",
        width: 350, height: 350, borderRadius: "50%",
        background: "rgba(37, 99, 235, 0.15)", filter: "blur(100px)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Glassmorphic Form Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 24,
        padding: "40px 32px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
        zIndex: 10,
        position: "relative",
        animation: "fade-up 0.5s ease-out both",
      }}>
        {/* Logo Head */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: "linear-gradient(135deg, var(--brand), var(--brand2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
            marginBottom: 16,
          }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M2 11L5.5 7L8.5 9.5L12.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12.5" cy="4" r="1.5" fill="white"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800,
            color: "#ffffff", letterSpacing: "-0.02em", margin: 0,
          }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.4)", marginTop: 6, margin: 0 }}>
            Sign in to manage your AI invoices
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(220, 38, 38, 0.15)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
            display: "flex", gap: 10, alignItems: "center",
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: "#f87171", fontWeight: 500, lineHeight: 1.3 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Username Input */}
          <div>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "rgba(255, 255, 255, 0.6)", marginBottom: 8,
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              placeholder="Enter your username"
              autoComplete="off"
              style={{
                width: "100%", height: 44,
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                padding: "0 14px",
                fontSize: 14,
                color: "#ffffff",
                outline: "none",
                transition: "all 0.2s",
              }}
              className="login-input"
            />
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{
                fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "rgba(255, 255, 255, 0.6)",
              }}>
                Password
              </label>
              <a href="#" style={{ fontSize: 11, color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
              autoComplete="off"
              style={{
                width: "100%", height: 44,
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                padding: "0 14px",
                fontSize: 14,
                color: "#ffffff",
                outline: "none",
                transition: "all 0.2s",
              }}
              className="login-input"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: 44,
              background: "linear-gradient(135deg, var(--brand), var(--brand2))",
              border: "none",
              borderRadius: 10,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8,
              marginTop: 10,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderTopColor: "#fff",
                  animation: "spin 0.8s linear infinite"
                }} />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          fontSize: 13, color: "rgba(255, 255, 255, 0.4)",
          textAlign: "center", marginTop: 32, margin: 0,
        }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 700 }}>
            Sign Up
          </Link>
        </p>
      </div>

      {/* Embedded CSS rules for styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-input:focus {
          border-color: var(--brand) !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25) !important;
          background: rgba(15, 23, 42, 0.6) !important;
        }
      `}} />
    </div>
  );
}
