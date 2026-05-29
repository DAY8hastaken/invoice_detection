// app/history/layout.js
import "../globals.css";
import SharedLayout from "../components/SharedLayout";
export const metadata = { title: "History · FinSight" };
export default function HistoryLayout({ children }) {
  return <SharedLayout>{children}</SharedLayout>;
}
