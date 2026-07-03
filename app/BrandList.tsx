"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

const AVATAR_COLORS = ["#C2410C", "#B45309", "#9A3412", "#A16207", "#7C5B3A"];
function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function BrandList({ brands }: { brands: Brand[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(q));
  }, [brands, query]);

  return (
    <>
      <div className="mt-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="今天想喝什麼？"
          className="w-full rounded-full border border-brew-100 bg-white px-5 py-3 text-sm text-brew-900 shadow-sm outline-none placeholder:text-brew-500/60 focus:border-accent"
        />
      </div>

      <ul className="no-scrollbar -mx-6 mt-6 flex snap-x gap-4 overflow-x-auto px-6 pb-6">
        {filtered.length ? (
          filtered.map((brand) => {
            const i = brands.indexOf(brand);
            return (
              <li key={brand.id} className="shrink-0 snap-start">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group flex w-44 flex-col items-center gap-3 rounded-2xl border border-brew-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {brand.logo_url ? (
                    <span className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-brew-100">
                      <Image
                        src={brand.logo_url}
                        alt={`${brand.name} logo`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                      style={{ backgroundColor: avatarColor(i) }}
                    >
                      {brand.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-base font-medium text-brew-900 group-hover:text-accent">
                    {brand.name}
                  </span>
                </Link>
              </li>
            );
          })
        ) : (
          <li className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-brew-200 py-10 text-brew-500">
            {brands.length ? (
              <span>找不到符合「{query}」的品牌</span>
            ) : (
              <>
                <span>尚無品牌資料</span>
                <span className="text-xs text-brew-500/70">
                  先到 Supabase Studio 建幾筆測試資料
                </span>
              </>
            )}
          </li>
        )}
      </ul>
    </>
  );
}
