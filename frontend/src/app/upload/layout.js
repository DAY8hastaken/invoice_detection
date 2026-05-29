// app/upload/layout.js
import "../globals.css";
import SharedLayout from "../components/SharedLayout";
export const metadata = { title: "Upload · FinSight" };
export default function UploadLayout({ children }) {
  return <SharedLayout>{children}</SharedLayout>;
}
