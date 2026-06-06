"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "▦" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: "🍾" },
      { href: "/admin/products/add", label: "Add Product", icon: "＋" },
      { href: "/admin/product-variants", label: "All Variants", icon: "📦" },
    ],
  },
  {
    label: "Taxonomy",
    items: [
      { href: "/admin/categories", label: "Categories", icon: "📂" },
      { href: "/admin/subcategories", label: "Subcategories", icon: "📁" },
      { href: "/admin/brands", label: "Brands", icon: "🏷️" },
      { href: "/admin/volumes", label: "Volumes", icon: "🧪" },
    ],
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #0c0c0e 0%, #111113 100%)",
          borderRight: "1px solid var(--glass-border)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <Link href="/" className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🍾</span>
            <span className="text-lg font-bold gold-gradient">Spiritz</span>
          </Link>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            Admin Panel
          </span>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs text-zinc-600 uppercase tracking-widest px-4 mb-2">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: active ? "rgba(201,168,76,0.1)" : "transparent",
                        color: active ? "var(--gold)" : "#a1a1aa",
                        border: active ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
                      }}
                    >
                      <span className="text-base w-5 text-center">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
