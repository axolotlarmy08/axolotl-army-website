"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { cart, removeItem, updateQuantity, total, itemCount, isOpen, closeCart } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border/50 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={32} className="text-muted/20 mb-3" />
              <p className="text-muted text-sm mb-2">Your cart is empty</p>
              <p className="text-muted/50 text-xs mb-4">
                Add some Axolotl Army merch
              </p>
              <button
                onClick={() => {
                  closeCart();
                  if (window.location.pathname === "/") {
                    const merch = document.getElementById("merch");
                    if (merch) merch.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#merch";
                  }
                }}
                className="text-accent text-sm hover:underline"
              >
                Browse Merch
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-surface border border-border/20"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-lg bg-surface-elevated overflow-hidden flex-shrink-0">
                    {item.mockupUrl ? (
                      <Image
                        src={item.mockupUrl}
                        alt={item.productLabel}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.characterImage}
                        alt={item.characterName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item.productLabel}
                    </h4>
                    <p className="text-xs text-muted">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity + remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted/40 hover:text-red-400 transition-colors"
                    >
                      <Trash size={14} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded bg-surface-elevated flex items-center justify-center text-muted hover:text-foreground transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium text-foreground w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-surface-elevated flex items-center justify-center text-muted hover:text-foreground transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-border/30 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-lg font-semibold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted/50">
              Free shipping worldwide.
            </p>
            <a
              href="/checkout"
              className="block w-full text-center bg-accent text-background font-medium py-3.5 rounded-full hover:bg-accent-dim transition-colors active:scale-[0.98]"
            >
              Checkout
            </a>
            <button
              onClick={() => {
                closeCart();
                // If we're on the home page, scroll to merch. Otherwise navigate there.
                if (window.location.pathname === "/") {
                  const merch = document.getElementById("merch");
                  if (merch) merch.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#merch";
                }
              }}
              className="block w-full text-center text-muted hover:text-foreground text-sm py-2 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
