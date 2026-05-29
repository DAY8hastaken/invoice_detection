import "../globals.css";
import SharedLayout from "../components/SharedLayout";
export const metadata = { title: "Settings · FinSight" };
export default function SettingsLayout({ children }) {
  return <SharedLayout>{children}</SharedLayout>;
}
