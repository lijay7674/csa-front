import { NavLink, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { type: 'divider' as const, label: '内容管理' },
  { label: '内容列表', path: '/content', icon: '📝' },
  { label: '内容审核', path: '/content/review', icon: '✅' },
  { label: '优秀成员展示', path: '/content/members', icon: '⭐' },
  { label: '竞赛成果展示', path: '/content/results', icon: '🏆' },
  { type: 'divider' as const, label: '数据管理' },
  { label: '成员管理', path: '/members', icon: '👥' },
  { label: '干部任职', path: '/members/cadres', icon: '📋' },
  { label: '活动管理', path: '/events', icon: '📅' },
  { label: '竞赛管理', path: '/competitions', icon: '🎯' },
  { label: '报名管理', path: '/registrations', icon: '📨' },
  { type: 'divider' as const, label: '其他' },
  { label: '题库管理', path: '/question-bank', icon: '📚' },
  { label: '权限管理', path: '/users', icon: '🔐' },
  { label: '统计查询', path: '/statistics', icon: '📈' },
];

export default function AdminSidebar() {
  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full text-white"
      style={{ background: 'var(--admin-sidebar)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 font-bold text-lg border-b border-white/10">
        <span className="px-2 py-0.5 text-xs rounded bg-white/10 font-mono">&lt;/&gt;</span>
        CSA 管理
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {MENU_ITEMS.map((item, i) => {
          if ('type' in item) {
            return (
              <div key={i} className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider mt-2 first:mt-0">
                {item.label}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: 'var(--admin-sidebar-active)' } : undefined
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-white/40 text-center">
        CSA Admin v0.1
      </div>
    </aside>
  );
}
