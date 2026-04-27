'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '🔮 Tử Vi', short: 'Tử Vi' },
  { href: '/kinh-dich', label: '☯ Kinh Dịch', short: 'Kinh Dịch' },
  { href: '/soi-bai', label: '🃏 Soi Bài', short: 'Soi Bài' },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="header-nav">
      <div className="header-nav-inner">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`header-nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <style jsx>{`
        .header-nav {
          background: rgba(10, 10, 20, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-nav-inner {
          display: flex;
          gap: 2px;
          padding: 6px 12px;
          max-width: 600px;
          margin: 0 auto;
        }
        .header-nav-link {
          padding: 5px 14px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .header-nav-link:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }
        .header-nav-link.active {
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
}
