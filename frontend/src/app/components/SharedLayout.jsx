"use client";
import "../globals.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function SharedLayout({ children }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-main" style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}
