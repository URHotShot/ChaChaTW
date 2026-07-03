// 用法：node --env-file=.env.local scripts/seed-brand.mjs data/brands/50lan.json
// 讀取品牌 JSON 資料，依序寫入 brands -> categories -> products -> variants -> prices。
// 用 SUPABASE_SECRET_KEY（略過 RLS），因為這是後台建檔用途，不是給前端呼叫的程式碼。

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const [, , jsonPath] = process.argv;
if (!jsonPath) {
  console.error("用法：node --env-file=.env.local scripts/seed-brand.mjs <json 檔路徑>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const data = JSON.parse(await readFile(jsonPath, "utf-8"));

const { data: brand, error: brandError } = await supabase
  .from("brands")
  .insert({
    name: data.name,
    slug: data.slug,
    official_url: data.official_url,
    description: data.description,
  })
  .select("id")
  .single();
if (brandError) throw brandError;

for (const [catIndex, category] of data.categories.entries()) {
  const { data: cat, error: catError } = await supabase
    .from("categories")
    .insert({ brand_id: brand.id, name: category.name, sort_order: catIndex })
    .select("id")
    .single();
  if (catError) throw catError;

  for (const product of category.products) {
    const { data: prod, error: prodError } = await supabase
      .from("products")
      .insert({
        category_id: cat.id,
        name: product.name,
        normalized_name: product.normalized_name ?? product.name,
        is_seasonal: product.is_seasonal ?? false,
      })
      .select("id")
      .single();
    if (prodError) throw prodError;

    for (const variant of product.variants) {
      const { data: v, error: vError } = await supabase
        .from("variants")
        .insert({ product_id: prod.id, size: variant.size })
        .select("id")
        .single();
      if (vError) throw vError;

      const { error: priceError } = await supabase.from("prices").insert({
        variant_id: v.id,
        price: variant.price,
        region: data.region ?? "全國",
      });
      if (priceError) throw priceError;
    }
  }
  console.log(`已匯入分類：${category.name}（${category.products.length} 品項）`);
}

console.log(`完成：${data.name}`);
