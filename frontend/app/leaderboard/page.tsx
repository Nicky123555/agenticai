'use client';

import { useStore } from '@/store/useStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserCard } from '@/components/leaderboard/UserCard';
import { Card, CardHeader } from '@/components/ui/Card';

export default function LeaderboardPage() {
  const users = useStore((s) => s.users);
  const sorted = [...users].sort((a, b) => b.xp - a.xp);

  const totalXp   = users.reduce((s, u) => s + u.xp, 0);
  const totalBadges = users.reduce((s, u) => s + u.badges.length, 0);
  const avgScore  = Math.round(users.reduce((s, u) => s + u.avgScore, 0) / users.length);

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        subtitle="// MOTIVATION AGENT · XP & BADGES"
        badge="LIVE SCORES"
      />

      {/* Team summary */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 24,
        }}
      >
        {[
          { label: 'Total Team XP',   value: totalXp.toLocaleString(),   icon: '⚡' },
          { label: 'Badges Earned',   value: totalBadges,                 icon: '🏅' },
          { label: 'Avg Task Score',  value: `${avgScore}/100`,           icon: '🎯' },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.7 }}>{s.icon}</span>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 22,
                  fontWeight: 800, color: 'var(--cyan)',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', letterSpacing: 1,
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ranking list */}
      <Card style={{ marginBottom: 0 }}>
        <CardHeader title="▲ Rankings" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((user, i) => (
            <UserCard key={user.handle} user={user} rank={i + 1} />
          ))}
        </div>
      </Card>
    </div>
  );
}
