/**
 * Shared types between the /api/printful/products route and the
 * client-side merch UI.
 */

export interface MerchProduct {
  syncProductId: number;
  name: string;
  thumbnail: string;
  /** Cheapest variant price — used on product cards. */
  startingPrice: number;
  /** Printful regions where this product can be fulfilled — e.g. ["US","EU","CA"]. */
  fulfillmentRegions: string[];
  colors: MerchColor[];
}

export interface MerchColor {
  color: string;
  colorCode: string;
  /** Primary image from Printful — the design-on-garment mockup, whichever side has the main design. */
  image: string;
  /** Which side of the garment `image` depicts: "front" | "back" | "left" | "right" | "sleeve" | "unknown". */
  imageSide: "front" | "back" | "left" | "right" | "sleeve" | "unknown";
  /** Back print artwork URL (transparent-BG artwork, not a garment mockup). Only set when the product has a back print AND the main image isn't already showing the back. */
  backImage?: string;
  sizes: MerchSize[];
}

export interface MerchSize {
  syncVariantId: number;
  variantId: number;
  size: string;
  retailPrice: number;
  inStock: boolean;
}

export interface ProductsApiResponse {
  products: MerchProduct[];
}
