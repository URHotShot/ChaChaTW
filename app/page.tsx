import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name")
    .limit(20);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-medium">ChaChaTW</h1>
      <p className="mt-2 text-gray-500">今天想喝什麼?滑一下看看。</p>

      {error && (
        <p className="mt-4 text-red-500">
          讀取品牌資料失敗,請確認 Supabase 連線設定與資料表是否已建立。
        </p>
      )}

      <ul className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {brands?.length ? (
          brands.map((brand) => (
            <li
              key={brand.id}
              className="min-w-[140px] rounded-xl border p-4 text-center"
            >
              {brand.name}
            </li>
          ))
        ) : (
          <li className="text-gray-400">尚無品牌資料,先到 Supabase Studio 建幾筆測試資料。</li>
        )}
      </ul>
    </main>
  );
}
