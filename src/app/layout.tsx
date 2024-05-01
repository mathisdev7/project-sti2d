import { NextAuthProvider } from "@/lib/providers";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextAuthProvider>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body>{children}</body>
        </html>
      </NextAuthProvider>
    </>
  );
}
