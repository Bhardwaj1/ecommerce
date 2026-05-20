"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">🍾</span>
        <span className="text-xl font-bold gold-gradient">Spiritz</span>
      </Link>

      <div className="hidden sm:flex items-center gap-8 text-sm text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">Shop</Link>
        <a href="#" className="hover:text-white transition-colors">Brands</a>
        <a href="#" className="hover:text-white transition-colors">Offers</a>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-zinc-400 hover:text-white transition-colors text-sm">Login</button>
        <Link href="/cart" className="relative gold-btn px-4 py-2 rounded-full text-sm flex items-center gap-2">
          🛒 Cart
          {totalItems > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: "#09090b", color: "var(--gold)", border: "1px solid var(--gold)" }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
