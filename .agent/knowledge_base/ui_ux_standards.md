# 🎨 UI/UX Standards (V2 — Tailwind CSS + React 19)

## 🌈 Brand Palette
```css
/* Huyền Học Theme — Dark/Mystical */
--color-primary: #6366f1;       /* Indigo — chủ đạo */
--color-primary-dark: #4f46e5;
--color-primary-light: #818cf8;
--color-accent: #f59e0b;        /* Amber — vàng kim */
--color-surface: #0f172a;       /* Slate-900 — nền tối */
--color-surface-card: #1e293b;  /* Slate-800 — card */
--color-text: #f1f5f9;          /* Slate-100 — text sáng */
--color-text-muted: #94a3b8;    /* Slate-400 */
--color-success: #10b981;
--color-error: #ef4444;
```

## 🔡 Typography
- **Font chính**: Inter (Google Fonts) — import trong `layout.tsx`
- **H1**: `text-3xl md:text-4xl font-extrabold tracking-tight`
- **H2**: `text-2xl font-bold`
- **H3**: `text-xl font-semibold`
- **Body**: `text-base leading-relaxed`
- **Caption**: `text-sm text-slate-400`

## 📏 Spacing & Layout
- **Page Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Spacing**: `py-12 md:py-20`
- **Grid Gap**: `gap-6 md:gap-8`
- **Lá Số Grid**: Ma trận 4×3 responsive (desktop) → stack (mobile)

## 🧱 Core Components

### Cards (Glassmorphism)
```
bg-slate-800/50 backdrop-blur-xl rounded-2xl
border border-slate-700/50 shadow-xl
hover:shadow-indigo-500/10 hover:-translate-y-1
transition-all duration-300
```

### Buttons
- **Primary**: `bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 active:scale-95 transition-all`
- **Ghost**: `bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl`

### PalaceMatrix (Lá Số Grid)
- Component: `src/components/PalaceMatrix.tsx`
- Grid 4 cột × 3 hàng (desktop), stack dọc (mobile)
- Mỗi cung hiển thị: Tên cung, Chính Tinh (kèm Miếu/Hãm badge), Phụ Tinh, Tứ Hóa tags
- Hover effect: highlight cung + Tam Hợp / Đối Cung

### NumerologyContent
- Component: `src/components/NumerologyContent.tsx`
- Biểu đồ các chỉ số con số (Expression, Life Path, etc.)

## ✨ Animation
- Dùng CSS transitions (`transition-all duration-300`) cho hover/click
- Tương lai: `framer-motion` cho page transitions và staggered children
- Loading skeleton states cho async data (chart generation)

## ✅ Checklist
- [ ] Tailwind class-first (KHÔNG inline CSS)
- [ ] Dark mode mặc định (Huyền Học theme)
- [ ] Mobile-first responsive grid
- [ ] Accessible color contrast (WCAG AA)
- [ ] Loading/Skeleton states cho mọi async UI
- [ ] Smooth transitions cho hover/click interactions
