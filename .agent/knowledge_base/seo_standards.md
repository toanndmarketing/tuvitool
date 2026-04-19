# 🔍 SEO & GEO Standards (V2 — Next.js App Router)

## 📋 Technical SEO Checklist (Bắt buộc)
- [ ] `layout.tsx` gốc có `metadata` export (title, description, openGraph)
- [ ] Mỗi page có `generateMetadata()` trả title + description unique
- [ ] Chỉ 1 `<h1>` per page, heading hierarchy chuẩn (H1 → H2 → H3)
- [ ] Canonical URL cho mọi page
- [ ] `sitemap.ts` tự động generate (Next.js App Router convention)
- [ ] `robots.ts` cấu hình đúng
- [ ] Image: `next/image` component với alt text, tự động WebP/AVIF
- [ ] URL slug: lowercase, dấu gạch ngang, không dấu tiếng Việt
- [ ] Mobile-first responsive (Tailwind breakpoints)
- [ ] Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Server Components mặc định (chỉ `'use client'` khi cần tương tác)

## 🤖 GEO (Generative Engine Optimization)
- [ ] File `llms.txt` tại root `public/`
- [ ] Structured Data (JSON-LD) cho SoftwareApplication, FAQPage
- [ ] E-E-A-T signals: Author bio, nguồn trích dẫn
- [ ] Content format: short paragraphs, bullet points
- [ ] FAQ sections dạng "People Also Ask"
- [ ] Topic clusters: Liên kết nội bộ giữa bài viết cùng chủ đề

## 📊 Schema.org (JSON-LD) — Ưu tiên cho Tử Vi Tool
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tử Vi Lá Số Tool",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "description": "Ứng dụng lập lá số Tử Vi Đẩu Số tích hợp AI",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "VND" }
}
```

## Triển khai trong Next.js
- **Metadata API**: Dùng `export const metadata` hoặc `generateMetadata()` trong `page.tsx` / `layout.tsx`.
- **JSON-LD**: Inject qua `<script type="application/ld+json">` trong Server Component.
- **Sitemap**: Tạo `src/app/sitemap.ts` export `default function sitemap()`.
- **Robots**: Tạo `src/app/robots.ts` export `default function robots()`.
