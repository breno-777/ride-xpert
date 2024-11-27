import type { Metadata } from "next";
import "@styles/_globals.scss";
import { AppProvider } from "@/hooks/context/AppProvider";

export const metadata: Metadata = {
  icons: '/favicon.ico',
  title: "Ride Xpert",
  description: "your smart platform for requesting rides quickly, safely and efficiently. Connect with available drivers and have the best urban mobility experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
