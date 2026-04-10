import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bad → Good Prompt",
  description: "Convert your messy prompts into professional ones for AI coding tools",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1e1b4b",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
