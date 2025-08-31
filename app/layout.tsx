import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // !TODO: Change this to your own domain
  metadataBase: new URL("https://sprout-and-scribble.vercel.app"),
  title: {
    default: "Sprout and Scribble - High-Quality Stationery & Creative Supplies",
    template: `%s | Sprout and Scribble`,
  },
  description:
    "Discover a world of creativity with Sprout and Scribble. We offer a curated selection of high-quality stationery, pens, notebooks, and other creative supplies to inspire your next project.",
  openGraph: {
    title: "Sprout and Scribble",
    description:
      "High-quality stationary and supplies for all your creative needs.",
    type: "website",
    locale: "en_US",
    url: "https://sprout-and-scribble.vercel.app",
    siteName: "Sprout and Scribble",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow md:px-12 mx-auto max-w-8xl">
            <Nav />
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
