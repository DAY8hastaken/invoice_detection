import "../globals.css";
import SharedLayout from "../components/SharedLayout";
export const metadata = { title: "Profile · FinSight" };
export default function ProfileLayout({ children }) {
  return <SharedLayout>{children}</SharedLayout>;
}
