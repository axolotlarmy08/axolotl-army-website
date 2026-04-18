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
  colors: MerchColor[];
}

export interface MerchColor {
  color: string;
  colorCode: string;
  /** Primary image — the design-on-garment front mockup. */
  image: string;
  /** Back print artwork URL, when the product has a back print. Transparent-BG artwork, not a garment mockup. */
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
