import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// 給純公開讀取（菜單、品牌列表等）的 Server Component 用。
// 刻意不碰 cookies()／next/headers，這樣頁面才能被 Next.js 靜態產生（SSG）
// 或用 ISR 定期重新驗證，而不是每次請求都強制動態渲染。
// 需要使用者登入狀態的頁面，請改用 lib/supabase/server.ts。
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
