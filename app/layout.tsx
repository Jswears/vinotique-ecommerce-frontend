import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ConfigureAmplifyClientSide from "./components/ConfigureAmplifyClientSide";
import ConfigureAmplify from "@/utils/configureAmplify";

export const metadata: Metadata = {
  title: "Vinotique",
  description: "The best wine store in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <ConfigureAmplify />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow bg-background text-foreground">
            <ConfigureAmplifyClientSide />
            {children}
          </main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
