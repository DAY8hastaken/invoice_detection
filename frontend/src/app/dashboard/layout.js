import "../globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export const metadata = { title: "FinSight Dashboard" };

export default function DashboardLayout({ children }) {
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
