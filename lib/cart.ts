/**
 * Cart types and helpers.
 * Cart state is managed in CartProvider via React Context + localStorage.
 */

export interface CartItem {
  id: string; // unique key: `${syncVariantId}`
  characterName: string;
  characterImage: string;
  productType: string;
  productLabel: string;
  /** Fulfillment regions from Printful — used to estimate shipping time. */
  fulfillmentRegions?: string[];
  /**
   * Printful sync_variant_id — required. Designs are already attached to
   * the sync variant in Printful, so the order payload just references
   * this id (no file URL needed).
   */
  syncVariantId: number;
  /** Printful catalog variant id — kept for margin lookups and debugging. */
  variantId: number;
  size: string;
  color: string;
  price: number; // in dollars (retail, shipping-inclusive)
  quantity: number;
  mockupUrl?: string;
}

export interface Cart {
  items: CartItem[];
}

export function emptyCart(): Cart {
  return { items: [] };
}

export function addToCart(cart: Cart, item: CartItem): Cart {
  const existing = cart.items.find((i) => i.id === item.id);
  if (existing) {
    return {
      items: cart.items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      ),
    };
  }
  return { items: [...cart.items, item] };
}

export function removeFromCart(cart: Cart, itemId: string): Cart {
  return { items: cart.items.filter((i) => i.id !== itemId) };
}

export function updateQuantity(
  cart: Cart,
  itemId: string,
  quantity: number
): Cart {
  if (quantity <= 0) return removeFromCart(cart, itemId);
  return {
    items: cart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
  };
}

export function cartTotal(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartItemCount(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function saveCart(cart: Cart): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("axo-cart", JSON.stringify(cart));
  }
}

export function loadCart(): Cart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const data = localStorage.getItem("axo-cart");
    return data ? JSON.parse(data) : emptyCart();
  } catch {
    return emptyCart();
  }
}
