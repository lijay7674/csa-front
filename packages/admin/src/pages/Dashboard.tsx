import { useEffect, useState } from 'react';
import { fetchOverview, fetchStatisticsByEventTypeRegistrations } from '../api/admin';
import useAuth from '../hooks/useAuth';

const STAT_CARDS = [
  { key: 'contentCount', label: '内容总数', icon: '📝', color: '#3B82F6' },
  { key: 'pendingContent', label: '待审核内容', icon: '⏳', color: '#F59E0B' },
  { key: 'memberCount', label: '注册成员', icon: '👥', color: '#8B5CF6' },
  { key: 'registrationCount', label: '报名总数', icon: '📨', color: '#22C55E' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [heatData, setHeatData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission, isSuperAdmin } = useAuth();

  useEffect(() => {
    Promise.all([
      fetchOverview(),
      fetchStatisticsByEventTypeRegistrations().catch(() => ({})),
    ])
      .then(([s, h]) => { setStats(s); setHeatData(h); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const heatEntries = Object.entries(heatData).sort(([, a], [, b]) => b - a);
  const maxHeat = Math.max(1, ...heatEntries.map(([, v]) => v));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--admin-text)' }}>Dashboard</h1>

      {loading && <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</p>}
      {error && <p className="text-sm text-red-500">加载失败: {error}</p>}

      {!loading && !error && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map(card => (
              <div key={card.key} className="p-5 rounded-xl border"
                style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{card.label}</span>
                  <span className="text-xl">{card.icon}</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: card.color }}>{stats[card.key] ?? 0}</div>
              </div>
            ))}
          </div>

          {/* 活动分布 + 报名热度 */}
          {heatEntries.length > 0 && (
            <div className="rounded-xl border overflow-hidden mb-8"
              style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
              <div className="px-5 py-3 border-b font-semibold text-sm" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
                📊 报名热度
              </div>
              <div className="p-5 space-y-3">
                {heatEntries.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-sm w-16 text-right font-medium" style={{ color: 'var(--admin-text)' }}>{type}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: 'var(--admin-bg)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((count / maxHeat) * 100)}%`, background: 'var(--admin-accent)', minWidth: count > 0 ? 4 : 0 }} />
                    </div>
                    <span className="text-sm w-12 font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
        <div className="px-5 py-3 border-b font-semibold text-sm" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          快速入口
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '内容管理', path: '/content', icon: '📝', permissions: ['content:write'] },
            { label: '报名管理', path: '/registrations', icon: '📨', permissions: ['registration:write'] },
            { label: '成员管理', path: '/members', icon: '👥', permissions: ['member:write'] },
            { label: '活动管理', path: '/events', icon: '📅', permissions: ['event:write'] },
            { label: '竞赛管理', path: '/competitions', icon: '🏆', permissions: ['competition:write'] },
            { label: '题库管理', path: '/question-bank', icon: '📚', permissions: ['question-bank:write'] },
            { label: '统计查询', path: '/statistics', icon: '📈', permissions: ['stats:read'] },
            { label: '权限管理', path: '/users', icon: '🔐', permissions: ['user:manage'] },
          ]
            .filter((item) => {
              if (isSuperAdmin) return true;
              if (!item.permissions || item.permissions.length === 0) return true;
              return item.permissions.some((p) => hasPermission(p));
            })
            .map((item) => (
              <a key={item.path} href={item.path}
                className="flex flex-col items-center gap-2 p-4 rounded-lg text-center no-underline transition-colors hover:bg-[var(--admin-accent-light)]"
                style={{ color: 'var(--admin-text)' }}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
