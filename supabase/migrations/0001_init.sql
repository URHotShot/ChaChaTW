-- ChaChaTW 初始資料庫 schema
-- 執行方式：supabase db push（本地開發）或透過 Supabase Studio SQL Editor 貼上執行

create extension if not exists "uuid-ossp";
create extension if not exists postgis;
create extension if not exists pg_trgm;

-- 品牌
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  official_url text,
  logo_url text,
  description text,
  created_at timestamptz not null default now()
);

-- 分類（例如：茶類、奶茶、鮮奶、果茶）
create table categories (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

-- 品項
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  -- 標準化名稱，用於跨品牌比對相同飲品（例如「青茶」「四季春」都對應 normalized_name）
  normalized_name text,
  is_seasonal boolean not null default false,
  available_from date,
  available_until date,
  caffeine_mg int,
  calories_kcal int,
  image_url text,
  created_at timestamptz not null default now()
);

-- 規格（M / L 等）
create table variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null
);

-- 價格（依地區、生效日期）
create table prices (
  id uuid primary key default uuid_generate_v4(),
  variant_id uuid not null references variants(id) on delete cascade,
  region text not null default '全國',
  price int not null,
  effective_from date not null default current_date,
  source text
);

-- 加料（珍珠、椰果等，品牌層級共用）
create table toppings (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  price int not null default 0
);

-- 分店（含地理座標，供「附近分店」查詢使用）
create table stores (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  address text,
  location geography(point, 4326),
  foodpanda_url text,
  ubereats_url text,
  nidin_url text,
  created_at timestamptz not null default now()
);

-- 使用者回報（菜單更新、價格錯誤等）
create table reports (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete set null,
  message text not null,
  status text not null default 'pending', -- pending / reviewed / rejected
  created_at timestamptz not null default now()
);

-- 同義詞表（跨品牌搜尋用，例如：青茶 = 四季春 = 清茶）
create table synonyms (
  id uuid primary key default uuid_generate_v4(),
  term text not null,
  normalized_name text not null
);

-- 索引
create index idx_categories_brand on categories(brand_id);
create index idx_products_category on products(category_id);
create index idx_products_normalized_name_trgm on products using gin (normalized_name gin_trgm_ops);
create index idx_variants_product on variants(product_id);
create index idx_prices_variant on prices(variant_id);
create index idx_stores_brand on stores(brand_id);
create index idx_stores_location on stores using gist(location);
create index idx_synonyms_term_trgm on synonyms using gin (term gin_trgm_ops);

-- Row Level Security：菜單類資料全部開放公開讀取，寫入僅限後台（service role）
alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table variants enable row level security;
alter table prices enable row level security;
alter table toppings enable row level security;
alter table stores enable row level security;
alter table synonyms enable row level security;
alter table reports enable row level security;

create policy "公開讀取" on brands for select using (true);
create policy "公開讀取" on categories for select using (true);
create policy "公開讀取" on products for select using (true);
create policy "公開讀取" on variants for select using (true);
create policy "公開讀取" on prices for select using (true);
create policy "公開讀取" on toppings for select using (true);
create policy "公開讀取" on stores for select using (true);
create policy "公開讀取" on synonyms for select using (true);

-- 使用者回報：允許任何人新增，但不能讀取他人回報內容
create policy "任何人可新增回報" on reports for insert with check (true);

-- 範例：查詢某座標 3 公里內的分店
-- select * from stores
-- where ST_DWithin(location, ST_MakePoint(:lng, :lat)::geography, 3000);
