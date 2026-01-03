import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Management System",
  description: "A full-stack customer management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
