import { createClient } from "@/lib/supabase/public";
import BrandList from "./BrandList";

export const revalidate = 3600; // ISR：每小時重新驗證一次，資料更新後最多延遲這麼久才會反映

export default async function Home() {
  const supabase = createClient();
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .order("name")
    .limit(20);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brew-900">
          今天想喝什麼？
        </h1>
        <p className="mt-3 text-brew-500">
          滑一下,挑個品牌,菜單、價格一次看到。
        </p>
      </section>

      {error && (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          讀取品牌資料失敗,請確認 Supabase 連線設定與資料表是否已建立。
        </p>
      )}

      <BrandList brands={brands ?? []} />
    </main>
  );
}
