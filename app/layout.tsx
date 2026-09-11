import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/store/data-provider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SkillMatch — Find Complementary Project Partners",
  description: "A startup-quality university project matching platform powered by weighted skill-overlap algorithms and the playful spirit of the Kasukabe Defense Corps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen flex flex-col bg-[#FFFDF9] text-shin-ink antialiased bg-crayon-grid selection:bg-shin-yellow selection:text-shin-ink">
        <DataProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
