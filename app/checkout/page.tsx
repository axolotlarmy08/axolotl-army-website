"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Truck, SpinnerGap, Package } from "@phosphor-icons/react";
import { useCart } from "@/components/CartProvider";
import { countries, getRegions } from "@/lib/regions";
import { calculateTax } from "@/lib/tax";
import { SHIPPING_CONFIG } from "@/lib/printful";

type Step = "cart" | "shipping" | "review" | "complete";

export default function CheckoutPage() {
  const { cart, total, removeItem, updateQuantity, clearCart } = useCart();

  const [step, setStep] = useState<Step>("cart");
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state_code: "",
    country_code: "US",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Shipping calculation
  const isFreeShipping = total >= SHIPPING_CONFIG.freeThreshold;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_CONFIG.flatRate;
  const amountToFreeShipping = SHIPPING_CONFIG.freeThreshold - total;

  // Tax calculation (only available after shipping step when we know location)
  const tax = step === "review" || step === "complete"
    ? calculateTax(total, shipping.country_code, shipping.state_code)
    : null;

  const grandTotal = total + shippingCost + (tax?.amount || 0);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            designUrl: "",
            productLabel: item.productLabel,
          })),
          shipping: {
            name: shipping.name,
            address1: shipping.address1,
            address2: shipping.address2,
            city: shipping.city,
            state_code: shipping.state_code,
            country_code: shipping.country_code,
            zip: shipping.zip,
          },
          email: shipping.email,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order failed");
      }

      clearCart();
      setStep("complete");
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0 && step !== "complete") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cart is empty</h1>
          <a href="/#merch" className="text-accent hover:underline text-sm">Browse merch</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pt-12 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        {step !== "complete" && (
          <button
            onClick={() => {
              if (step === "cart") window.location.href = "/#merch";
              else if (step === "shipping") setStep("cart");
              else if (step === "review") setStep("shipping");
            }}
            className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            {step === "cart" ? "Continue Shopping" : step === "shipping" ? "Back to cart" : "Edit shipping"}
          </button>
        )}

        {/* Progress */}
        {step !== "complete" && (
          <div className="flex items-center gap-2 mb-10">
            {(["cart", "shipping", "review"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s ? "bg-accent text-background" :
                  (["cart","shipping","review"].indexOf(step) > i) ? "bg-accent/20 text-accent" :
                  "bg-surface text-muted"
                }`}>{i + 1}</div>
                <span className={`text-xs font-medium ${step === s ? "text-foreground" : "text-muted/50"}`}>
                  {s === "cart" ? "Cart" : s === "shipping" ? "Shipping" : "Review & Pay"}
                </span>
                {i < 2 && <div className="w-8 h-px bg-border/30 mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 1: CART ─── */}
        {step === "cart" && (
          <>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Your Cart</h1>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/20">
                  <div className="w-16 h-16 rounded-xl bg-surface-elevated overflow-hidden flex-shrink-0">
                    <Image src={item.characterImage} alt={item.productLabel} width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground">{item.productLabel}</h3>
                    <p className="text-xs text-muted">{item.size} / {item.color}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="bg-surface-elevated border border-border/30 rounded-lg text-sm text-foreground px-2 py-1">
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span className="text-sm font-semibold text-foreground w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-muted/40 hover:text-red-400 text-xs">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping info banner */}
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 mb-6">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-accent flex-shrink-0" />
                <div>
                  {isFreeShipping ? (
                    <p className="text-sm text-accent font-medium">You qualify for free shipping!</p>
                  ) : (
                    <>
                      <p className="text-sm text-foreground">
                        Flat rate shipping: <strong>${SHIPPING_CONFIG.flatRate.toFixed(2)}</strong>
                      </p>
                      <p className="text-xs text-muted">
                        Spend ${amountToFreeShipping.toFixed(2)} more for free shipping (orders over ${SHIPPING_CONFIG.freeThreshold})
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border/20 mb-2">
              <span className="text-foreground font-medium">Subtotal</span>
              <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 mb-6">
              <span className="text-sm text-muted">Shipping</span>
              <span className="text-sm text-foreground">
                {isFreeShipping ? (
                  <span className="text-accent font-medium">FREE</span>
                ) : (
                  `$${SHIPPING_CONFIG.flatRate.toFixed(2)}`
                )}
              </span>
            </div>

            <button onClick={() => setStep("shipping")} className="w-full bg-accent text-background font-medium py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98]">
              Continue to Shipping
            </button>
            <a
              href="/#merch"
              className="block w-full text-center text-muted hover:text-foreground text-sm py-3 transition-colors"
            >
              Continue Shopping
            </a>
          </>
        )}

        {/* ─── STEP 2: SHIPPING ADDRESS ─── */}
        {step === "shipping" && (
          <>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Shipping Address</h1>

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1.5">Full Name</label>
                  <input required value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">Email</label>
                  <input type="email" required value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Country</label>
                <select value={shipping.country_code} onChange={(e) => setShipping({...shipping, country_code: e.target.value, state_code: ""})}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Address Line 1</label>
                <input required value={shipping.address1} onChange={(e) => setShipping({...shipping, address1: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Address Line 2 (optional)</label>
                <input value={shipping.address2} onChange={(e) => setShipping({...shipping, address2: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1.5">City</label>
                  <input required value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  {(() => {
                    const { label, regions } = getRegions(shipping.country_code);
                    return (
                      <>
                        <label className="block text-sm text-muted mb-1.5">{label}</label>
                        {regions.length > 0 ? (
                          <select required value={shipping.state_code} onChange={(e) => setShipping({...shipping, state_code: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                            <option value="">Select {label}</option>
                            {regions.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                          </select>
                        ) : (
                          <input value={shipping.state_code} onChange={(e) => setShipping({...shipping, state_code: e.target.value})}
                            placeholder="Region (optional)"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                        )}
                      </>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{shipping.country_code === "US" ? "ZIP Code" : "Postal Code"}</label>
                  <input required value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent text-background font-medium py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98] mt-4">
                <Package size={18} />
                Continue to Review
              </button>
            </form>
          </>
        )}

        {/* ─── STEP 3: REVIEW & PAY ─── */}
        {step === "review" && (
          <>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Review & Pay</h1>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground">{item.productLabel}</span>
                    <span className="text-xs text-muted ml-2">{item.size} / {item.color} x{item.quantity}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Shipping address */}
            <div className="p-4 rounded-2xl bg-surface border border-border/20 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Shipping to</p>
                  <p className="text-sm text-foreground">{shipping.name}</p>
                  <p className="text-xs text-muted">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ""}</p>
                  <p className="text-xs text-muted">{shipping.city}, {shipping.state_code} {shipping.zip}, {shipping.country_code}</p>
                </div>
                <button onClick={() => setStep("shipping")} className="text-accent text-xs hover:underline">Edit</button>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="p-4 rounded-2xl bg-surface border border-border/20 mb-6">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-accent" />
                <div>
                  <p className="text-sm text-foreground">Estimated delivery: 5-11 business days</p>
                  <p className="text-xs text-muted">Includes 2-5 days production + shipping from nearest facility</p>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl bg-surface border border-border/20 mb-6 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-sm text-foreground">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Shipping</span>
                {isFreeShipping ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted line-through">${SHIPPING_CONFIG.flatRate.toFixed(2)}</span>
                    <span className="text-sm text-accent font-medium">FREE</span>
                  </div>
                ) : (
                  <span className="text-sm text-foreground">${shippingCost.toFixed(2)}</span>
                )}
              </div>
              {tax && tax.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted">{tax.label}</span>
                  <span className="text-sm text-foreground">${tax.amount.toFixed(2)}</span>
                </div>
              )}
              {tax && tax.amount === 0 && tax.label !== "Tax" && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted">{tax.label}</span>
                  <span className="text-sm text-accent">$0.00</span>
                </div>
              )}
              <div className="border-t border-border/20 pt-2.5 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full bg-accent text-background font-medium py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
            </button>

            <p className="text-center text-muted/40 text-xs mt-3">
              Secure checkout powered by Stripe. Printed and shipped by Printful.
            </p>
          </>
        )}

        {/* ─── STEP 4: COMPLETE ─── */}
        {step === "complete" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={28} className="text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Placed</h1>
            <p className="text-muted text-lg max-w-md mx-auto mb-8">
              Your order has been submitted. Printful will print and ship it from the facility nearest to you.
              You&apos;ll receive tracking info at <strong className="text-foreground">{shipping.email}</strong>.
            </p>
            <a href="/" className="inline-flex items-center justify-center bg-accent text-background font-medium px-8 py-3 rounded-full hover:bg-accent-dim transition-colors">
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
