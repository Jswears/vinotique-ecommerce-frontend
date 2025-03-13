import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ConfigureAmplify from "@/utils/configureAmplify";

export const metadata: Metadata = {
  title: "Vinotique Wine Shop",
  description: "The best wine store in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col justify-between min-h-screen bg-background text-foreground">
        <ConfigureAmplify />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-screen flex-grow bg-background text-foreground">
            {children}
          </main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>

    </html>
  );
}
