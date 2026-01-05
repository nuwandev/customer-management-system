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
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-gray-50">{children}</body>
    </html>
  );
}
