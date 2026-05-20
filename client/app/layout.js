import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "../context/AdminContext";
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Spiritz — Premium Alcohol Store",
  description: "Shop premium beers, whisky, wine and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950">
        <AdminProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
