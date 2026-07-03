-- ChaChaTW 測試資料：50嵐
-- 執行方式：Supabase Studio SQL Editor 貼上執行，或 supabase db reset 時自動套用
--
-- 注意：以下品項名稱是常見的 50嵐經典款，但「價格」是佔位數字，
-- 上線前務必對照官方菜單或實際拍照的菜單核對後修正，不要直接當真實價格使用。

with new_brand as (
  insert into brands (name, slug, official_url, description)
  values ('50嵐', '50lan', 'https://50lan.com', '台灣連鎖手搖飲品牌，經典款包括四季春、珍珠奶茶。')
  returning id
),
cat_tea as (
  insert into categories (brand_id, name, sort_order)
  select id, '茶類', 1 from new_brand
  returning id
),
cat_milk_tea as (
  insert into categories (brand_id, name, sort_order)
  select id, '奶茶類', 2 from new_brand
  returning id
),

-- 品項：茶類
prod_si_ji_chun as (
  insert into products (category_id, name, normalized_name)
  select id, '四季春', '四季春' from cat_tea
  returning id
),
prod_black_tea as (
  insert into products (category_id, name, normalized_name)
  select id, '阿薩姆紅茶', '紅茶' from cat_tea
  returning id
),

-- 品項：奶茶類
prod_pearl_milk_tea as (
  insert into products (category_id, name, normalized_name)
  select id, '珍珠奶茶', '珍珠奶茶' from cat_milk_tea
  returning id
),

-- 規格：每個品項一個 M、一個 L
variant_si_ji_chun_m as (
  insert into variants (product_id, size)
  select id, 'M' from prod_si_ji_chun
  returning id
),
variant_si_ji_chun_l as (
  insert into variants (product_id, size)
  select id, 'L' from prod_si_ji_chun
  returning id
),
variant_black_tea_m as (
  insert into variants (product_id, size)
  select id, 'M' from prod_black_tea
  returning id
),
variant_black_tea_l as (
  insert into variants (product_id, size)
  select id, 'L' from prod_black_tea
  returning id
),
variant_pearl_milk_tea_m as (
  insert into variants (product_id, size)
  select id, 'M' from prod_pearl_milk_tea
  returning id
),
variant_pearl_milk_tea_l as (
  insert into variants (product_id, size)
  select id, 'L' from prod_pearl_milk_tea
  returning id
),

-- 價格（TODO：對照官方菜單核對後修正）
price_si_ji_chun_m as (
  insert into prices (variant_id, price)
  select id, 20 from variant_si_ji_chun_m
),
price_si_ji_chun_l as (
  insert into prices (variant_id, price)
  select id, 25 from variant_si_ji_chun_l
),
price_black_tea_m as (
  insert into prices (variant_id, price)
  select id, 20 from variant_black_tea_m
),
price_black_tea_l as (
  insert into prices (variant_id, price)
  select id, 25 from variant_black_tea_l
),
price_pearl_milk_tea_m as (
  insert into prices (variant_id, price)
  select id, 30 from variant_pearl_milk_tea_m
),
price_pearl_milk_tea_l as (
  insert into prices (variant_id, price)
  select id, 35 from variant_pearl_milk_tea_l
)
select 1;
