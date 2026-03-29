'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_ITEMS = [
  { href: '/',            icon: '⬡', title: 'Dashboard'   },
  { href: '/project',     icon: '＋', title: 'New Project' },
  { href: '/tasks',       icon: '◈', title: 'Tasks'       },
  { href: '/leaderboard', icon: '▲', title: 'Leaderboard' },
  { href: '/logs',        icon: '◉', title: 'Audit Logs'  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      {SIDEBAR_ITEMS.map(({ href, icon, title }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            title={title}
            style={{
              ...styles.btn,
              ...(active ? styles.btnActive : {}),
            }}
          >
            {icon}
          </Link>
        );
      })}
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 56, background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '20px 0', gap: 8,
    position: 'fixed', top: 60, bottom: 0, left: 0, zIndex: 100,
  },
  btn: {
    width: 40, height: 40, borderRadius: 8,
    border: '1px solid transparent', background: 'transparent',
    color: 'var(--text-muted)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, textDecoration: 'none', transition: 'all 0.2s',
  },
  btnActive: {
    color: 'var(--cyan)', background: 'var(--cyan-glow)',
    borderColor: 'var(--border-glow)',
  },
};
