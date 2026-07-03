import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/public";

export const revalidate = 3600; // ISR：每小時重新驗證一次，資料更新後最多延遲這麼久才會反映

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: brands } = await supabase.from("brands").select("slug");
  return (brands ?? []).map((brand) => ({ slug: brand.slug }));
}

interface Price {
  price: number;
  effective_from: string;
}

interface Variant {
  id: string;
  size: string;
  prices: Price[];
}

interface Product {
  id: string;
  name: string;
  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
  sort_order: number;
  products: Product[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categories: Category[];
}

async function getBrand(slug: string): Promise<Brand | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      id, name, slug, description,
      categories (
        id, name, sort_order,
        products (
          id, name,
          variants (
            id, size,
            prices ( price, effective_from )
          )
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as unknown as Brand;
}

function latestPrice(variant: Variant): number | null {
  if (!variant.prices.length) return null;
  return [...variant.prices].sort((a, b) =>
    b.effective_from.localeCompare(a.effective_from),
  )[0].price;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "找不到品牌 - ChaChaTW" };

  return {
    title: `${brand.name}菜單 - ChaChaTW`,
    description: brand.description ?? `查詢 ${brand.name} 完整菜單與價格。`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const categories = [...brand.categories].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/" className="text-sm text-brew-500 hover:text-accent">
        ← 返回首頁
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-brew-900">{brand.name}</h1>
      {brand.description && (
        <p className="mt-2 text-brew-500">{brand.description}</p>
      )}

      {categories.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-brew-200 py-10 text-center text-brew-500">
          尚無菜單資料。
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="border-b-2 border-accent pb-1 text-base font-semibold text-brew-900">
              {category.name}
            </h2>
            <ul className="mt-1 divide-y divide-brew-100">
              {category.products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="truncate text-sm text-brew-900">
                    {product.name}
                  </span>
                  <span className="flex shrink-0 gap-2.5 tabular-nums">
                    {product.variants.map((variant) => {
                      const price = latestPrice(variant);
                      return (
                        <span
                          key={variant.id}
                          className="flex items-center gap-1 text-xs font-medium text-brew-600"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brew-100 text-[10px] text-brew-700">
                            {variant.size.charAt(0)}
                          </span>
                          {price != null ? price : "-"}
                        </span>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
