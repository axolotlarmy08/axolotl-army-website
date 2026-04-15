import { NextResponse } from "next/server";
import {
  getCatalogProduct,
  getCatalogVariants,
  PRODUCT_CONFIG,
  type ProductType,
} from "@/lib/printful";

// Cache product data for 5 minutes
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    // Return cache if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    const products = await Promise.all(
      (Object.keys(PRODUCT_CONFIG) as ProductType[]).map(async (type) => {
        const config = PRODUCT_CONFIG[type];
        const [product, variants] = await Promise.all([
          getCatalogProduct(config.printfulId),
          getCatalogVariants(config.printfulId),
        ]);

        // Group variants by color, pick sizes
        const colorGroups: Record<
          string,
          {
            color: string;
            colorCode: string;
            image: string;
            sizes: Array<{
              variantId: number;
              size: string;
              inStock: boolean;
            }>;
          }
        > = {};

        for (const v of variants) {
          if (!colorGroups[v.color]) {
            colorGroups[v.color] = {
              color: v.color,
              colorCode: v.color_code || "#000",
              image: v.image,
              sizes: [],
            };
          }
          colorGroups[v.color].sizes.push({
            variantId: v.id,
            size: v.size,
            inStock: true, // catalog variants are always available
          });
        }

        return {
          type,
          printfulId: config.printfulId,
          name: product.name,
          brand: product.brand,
          description: product.description,
          price: config.basePrice,
          image: product.image,
          colors: Object.values(colorGroups),
        };
      })
    );

    const response = { products };
    cache = { data: response, timestamp: Date.now() };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Printful products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
