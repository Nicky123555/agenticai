'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

const NAV_LINKS = [
  { href: '/', label: '⬡ Dashboard' },
  { href: '/project', label: '＋ Project' },
  { href: '/tasks', label: '◈ Tasks' },
  { href: '/leaderboard', label: '▲ Leaderboard' },
  { href: '/logs', label: '◉ Audit Logs' },
];

export function Navbar() {
  const pathname = usePathname();
  const agents = useStore((s) => s.agents);
  const online = agents.filter((a) => a.active).length;

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⬡</div>
        <span style={styles.logoText}>
          NEX<span style={{ color: 'var(--cyan)' }}>US</span>
        </span>
      </div>

      {/* Links */}
      <ul style={styles.links}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                style={{
                  ...styles.link,
                  ...(active ? styles.linkActive : {}),
                }}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Status */}
      <div style={styles.status}>
        <div style={styles.statusDot} className="animate-pulse-green" />
        <span className="animate-flicker">{online} AGENTS ONLINE</span>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
    background: 'rgba(4,8,16,0.92)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', zIndex: 1000,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    width: 32, height: 32,
    border: '2px solid var(--cyan)', borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--cyan)', fontSize: 16,
    boxShadow: '0 0 12px var(--cyan-glow)',
  },
  logoText: {
    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
    color: 'var(--text-primary)', letterSpacing: 3,
  },
  links: { display: 'flex', gap: 4, listStyle: 'none' },
  link: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 6, textDecoration: 'none',
    fontSize: 11, fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)', letterSpacing: 1,
    borderWidth: 1, borderStyle: 'solid', borderColor: 'transparent', 
    transition: 'all 0.2s',
  },
  linkActive: {
    color: 'var(--cyan)', background: 'var(--cyan-glow)',
    borderColor: 'var(--border-glow)',
  },
  status: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-mono)',
  },
  statusDot: {
    width: 6, height: 6, background: 'var(--green)', borderRadius: '50%',
  },
};
