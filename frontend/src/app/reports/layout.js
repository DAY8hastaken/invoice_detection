// app/reports/layout.js
import "../globals.css";
import SharedLayout from "../components/SharedLayout";
export const metadata = { title: "Reports · FinSight" };
export default function ReportsLayout({ children }) {
  return <SharedLayout>{children}</SharedLayout>;
}
