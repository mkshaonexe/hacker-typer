import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hacker Typer Pro Max — Interactive Code Typer Workspace",
  description: "Reveal stunning source code structures with every keystroke. Use a preset template or upload your own ZIP project. Real mechanical click sounds synthesized via Web Audio API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
