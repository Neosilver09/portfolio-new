import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anishan Sebanathan — AI Engineer & ML Specialist",
  description: "M.S. Aerospace Engineering (Georgia Tech, GPA 4.0) · M.S. Computer Science (INP-ENSEEIHT). AI Engineer specializing in machine learning, perception systems, and data-driven optimization.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
