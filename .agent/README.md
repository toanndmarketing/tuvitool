# 🤖 WB-Agent Configuration (ASF 3.3)

> **Project**: tu-vi-la-so
> **Type**: Web SaaS (B2B)
> **Generated**: 2026-02-25

## 🏗️ Architecture

- `.agent/identity/`: Định nghĩa Persona & Soul của AI.
- `.agent/knowledge_base/`: Kho tri thức về Business, Data, API, SEO.
- `.agent/skills/`: Các kỹ năng AI chuyên biệt (@mentions).
- `.agent/workflows/`: Các quy trình tự động hóa (/commands).
- `.agent/memory/`: Project Constitution (Luật dự án).

## 🔍 SEO & GEO
- `@speckit.seo`: Audit Technical SEO (Meta, Sitemap, Core Web Vitals)
- `@speckit.geo`: Tối ưu cho AI Search (llms.txt, E-E-A-T, Schema.org)
- `knowledge_base/seo_standards.md`: Checklist & JSON-LD templates

## 🚀 Quick Start
1. Run `/01-speckit.constitution` để thiết lập luật dự án.
2. Run `@speckit.identity` để tinh chỉnh Persona của AI.
3. Run `/02-speckit.specify` để bắt đầu tính năng mới.
