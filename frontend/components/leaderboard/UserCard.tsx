import { Avatar } from '@/components/ui/Avatar';
import { EmojiBadge } from '@/components/ui/Badge';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  rank: number;
}

const RANK_ICON: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_BORDER: Record<number, string> = {
  1: 'rgba(255,204,0,0.4)',
  2: 'rgba(107,138,170,0.4)',
  3: 'rgba(249,115,22,0.4)',
};
const RANK_COLOR: Record<number, string> = {
  1: 'var(--yellow)',
  2: 'var(--text-secondary)',
  3: 'var(--orange)',
};

export function UserCard({ user, rank }: UserCardProps) {
  const pct = Math.round((user.xp / user.maxXp) * 100);

  return (
    <div
      className="animate-fadeInUp"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${RANK_BORDER[rank] ?? 'var(--border)'}`,
        borderRadius: 8, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'all 0.2s',
        boxShadow: rank === 1 ? '0 0 20px rgba(255,204,0,0.08)' : undefined,
        animationDelay: `${rank * 60}ms`,
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
          width: 36, textAlign: 'center',
          color: RANK_COLOR[rank] ?? 'var(--text-muted)',
        }}
      >
        {RANK_ICON[rank] ?? `#${rank}`}
      </div>

      {/* Avatar */}
      <Avatar letter={user.avatar} color={user.avatarColor} size={40} />

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 4,
          }}
        >
          {user.name}{' '}
          <span
            style={{
              fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            }}
          >
            @{user.handle}
          </span>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {user.badges.map((b) => (
            <EmojiBadge key={b}>{b}</EmojiBadge>
          ))}
        </div>

        <div
          style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          }}
        >
          {user.tasksCompleted} tasks · avg score {user.avgScore}
        </div>
      </div>

      {/* XP bar */}
      <div style={{ width: 140 }}>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', marginBottom: 4,
          }}
        >
          <span>XP</span>
          <span
            style={{
              fontSize: 12, fontFamily: 'var(--font-display)',
              fontWeight: 700, color: 'var(--cyan)',
            }}
          >
            {user.xp.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            height: 4, background: 'var(--border)',
            borderRadius: 2, overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--cyan), var(--green))',
              borderRadius: 2, transition: 'width 1s ease',
            }}
          />
        </div>
        <div
          style={{
            textAlign: 'right', fontSize: 9, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', marginTop: 3,
          }}
        >
          {user.maxXp} XP CAP
        </div>
      </div>
    </div>
  );
}
