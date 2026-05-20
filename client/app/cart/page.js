"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <span className="text-8xl">🛒</span>
          <h1 className="text-3xl font-bold text-white">Your cart is empty</h1>
          <p className="text-zinc-400">Looks like you haven't added anything yet.</p>
          <Link href="/" className="gold-btn px-8 py-3 rounded-full text-base font-bold">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = totalPrice > 2000 ? 0 : 99;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Your <span className="gold-text">Cart</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map(({ product, qty }) => (
              <div
                key={product.id}
                className="glass rounded-2xl p-5 flex items-center gap-5"
                style={{ transition: "border-color 0.2s ease" }}
              >
                {/* Emoji */}
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: "linear-gradient(145deg, #111113, #1c1c1f)" }}
                >
                  {product.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">{product.category}</p>
                  <h3 className="text-white font-semibold text-base truncate">{product.name}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{product.volume} · {product.alcoholPercent}% ABV</p>
                  <span className="gold-gradient font-bold text-lg">₹{product.price}</span>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(product.id, qty - 1)}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:border-yellow-600/50 transition-colors text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-white font-semibold w-6 text-center">{qty}</span>
                  <button
                    onClick={() => updateQty(product.id, qty + 1)}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:border-yellow-600/50 transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Line total + remove */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                  <span className="text-white font-bold text-base">
                    ₹{(Number(product.price.replace(/,/g, "")) * qty).toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 flex flex-col gap-5 sticky top-24">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-400 font-medium" : "text-white"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-zinc-600">
                    Add ₹{(2000 - totalPrice).toLocaleString("en-IN")} more for free delivery
                  </p>
                )}
                <div
                  className="flex justify-between pt-3 border-t font-bold text-base"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <span className="text-white">Total</span>
                  <span className="gold-gradient text-xl">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button className="gold-btn w-full py-4 rounded-2xl text-base font-bold">
                Proceed to Checkout →
              </button>

              <Link
                href="/"
                className="text-center text-sm text-zinc-500 hover:text-white transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>

      <footer className="glass border-t border-zinc-800 px-6 py-8 text-center text-zinc-500 text-sm mt-12">
        <p className="gold-gradient font-bold text-base mb-1">Spiritz</p>
        <p>© 2025 Spiritz. Drink responsibly. 21+ only.</p>
      </footer>
    </div>
  );
}
