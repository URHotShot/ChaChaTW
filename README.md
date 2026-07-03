# ChaChaTW 環境建置指南

## 需要你自己操作的帳號申請（我沒辦法代為註冊）

### 1. GitHub Repo
1. 到 github.com 建立新的 repository，命名 `chachatw`（private 或 public 皆可）
2. 把這個資料夾內容 push 上去：
   ```
   cd chachatw
   git init
   git add .
   git commit -m "init: project scaffold"
   git branch -M main
   git remote add origin <你的 repo URL>
   git push -u origin main
   ```

### 2. Supabase 專案
1. 到 https://supabase.com 註冊並登入
2. New Project，選擇離台灣最近的區域（目前是 Singapore，`ap-southeast-1`）
3. 記下建立時設定的資料庫密碼（等等 CLI 連線會用到）
4. 進入 Project Settings > API，複製以下兩組值填進 `.env.local`（複製 `.env.example` 改名）：
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`（僅用在伺服器端程式，絕對不能外洩）
5. 安裝 Supabase CLI 並套用 migration：
   ```
   npm install -g supabase
   supabase login
   supabase link --project-ref <你的 project ref，在 URL 或 Settings 可找到>
   supabase db push
   ```
   這會把 `supabase/migrations/0001_init.sql` 套用到你的資料庫，建立 brands / products / stores 等表。
6. 進入 Supabase Studio > Table Editor，手動新增 2-3 筆測試品牌資料，確認首頁能讀到

### 3. Cloudflare（Pages + R2）
1. 到 https://dash.cloudflare.com 註冊
2. **R2**：左側選單 R2 > Create bucket，命名 `chachatw-images`，之後把 credentials 填進 `.env.local` 的 `R2_*` 欄位
3. **Pages**：左側選單 Workers & Pages > Create > Pages > Connect to Git，選你剛剛的 GitHub repo
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Framework preset 選 Next.js
   - 在 Environment Variables 把 `.env.local` 內容原封不動貼上去（Production 和 Preview 都要填）

### 4. 網域
1. 去 Namecheap / GoDaddy / Cloudflare Registrar 查詢 `chachatw.com`、`chachatw.tw` 可用性並購買
2. 買好後回到 Cloudflare Pages 專案 > Custom domains 綁定即可，Cloudflare 會自動處理 DNS 與 HTTPS

---

## 我已經幫你準備好的部分

- Next.js 15 + TypeScript + Tailwind 專案骨架
- Supabase 的 server / browser client helper（`lib/supabase/`）
- 首頁範例：讀取 `brands` 表並顯示（驗證連線用）
- 完整資料庫 schema migration（`supabase/migrations/0001_init.sql`），包含：
  - 品牌、分類、品項、規格、價格、加料、分店（PostGIS）、使用者回報、同義詞表
  - `pg_trgm` 全文檢索索引、PostGIS 地理索引
  - Row Level Security：菜單資料公開可讀，寫入僅限 service role（後台用）

## 本地啟動

```
cd chachatw
npm install
cp .env.example .env.local   # 填入上面申請到的金鑰
npm run dev
```

打開 http://localhost:3000，如果看到「尚無品牌資料」代表連線成功，去 Supabase Studio 建幾筆測試資料就能看到畫面出現品牌卡片。

## 下一步建議

環境跑起來、資料庫連線確認沒問題後，可以進入：
1. 建檔工作流程（怎麼把第一批 5-10 個品牌的菜單資料匯入）
2. 品牌頁 / 品項頁的路由與 SEO metadata 規劃
3. 首頁滑動選單的實作
