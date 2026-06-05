import { NavLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  /** 额外匹配的子路径（如 content 应匹配 /content 但不应匹配 /content/review） */
  extraMatch?: string[];
  /** 允许访问的权限点。空/undefined = 所有人可见。拥有 user:manage 权限者始终可见。 */
  permissions?: string[];
}

const MENU_ITEMS: (MenuItem | { type: 'divider'; label: string })[] = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { type: 'divider', label: '内容管理' },
  { label: '内容列表', path: '/content', icon: '📝', extraMatch: ['/content/new', '/content/:id'], permissions: ['content:write'] },
  { label: '内容审核', path: '/content/review', icon: '✅', permissions: ['content:review'] },
  { label: '优秀成员展示', path: '/content/members', icon: '⭐', permissions: ['content:write'] },
  { label: '竞赛成果展示', path: '/content/results', icon: '🏆', permissions: ['content:write'] },
  { type: 'divider', label: '数据管理' },
  { label: '成员管理', path: '/members', icon: '👥', permissions: ['member:write'] },
  { label: '干部任职', path: '/members/cadres', icon: '📋', permissions: ['cadre:write'] },
  { label: '活动管理', path: '/events', icon: '📅', permissions: ['event:write'] },
  { label: '竞赛管理', path: '/competitions', icon: '🎯', permissions: ['competition:write'] },
  { label: '报名管理', path: '/registrations', icon: '📨', permissions: ['registration:write'] },
  { type: 'divider', label: '其他' },
  { label: '题库管理', path: '/question-bank', icon: '📚', permissions: ['question-bank:write'] },
  { label: '权限管理', path: '/users', icon: '🔐', permissions: ['user:manage'] },
  { label: '统计查询', path: '/statistics', icon: '📈', permissions: ['stats:read'] },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { hasPermission, isSuperAdmin } = useAuth();

  const canAccess = (item: MenuItem): boolean => {
    if (isSuperAdmin) return true;
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some((p) => hasPermission(p));
  };

  const isActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.extraMatch) {
      return item.extraMatch.some((m) => {
        // 处理 :id 动态参数 — 匹配 /content/123/edit 之类
        return new RegExp(
          '^' +
            item.path.replace(/:\w+/g, '\\d+') +
            m.replace(/:\w+/g, '\\d+') +
            '(?:/edit)?$',
        ).test(location.pathname);
      });
    }
    return false;
  };

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full text-white"
      style={{ background: 'var(--admin-sidebar)' }}
    >
      <div className="h-16 flex items-center gap-3 px-5 font-bold text-lg border-b border-white/10">
        <span className="px-2 py-0.5 text-xs rounded bg-white/10 font-mono">
          &lt;/&gt;
        </span>
        CSA 管理
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {MENU_ITEMS.map((item, i) => {
          if ('type' in item) {
            return (
              <div
                key={i}
                className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider mt-2 first:mt-0"
              >
                {item.label}
              </div>
            );
          }

          if (!canAccess(item)) return null;

          const active = isActive(item);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                active
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={
                active
                  ? { background: 'var(--admin-sidebar-active)' }
                  : undefined
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-white/40 text-center">
        CSA Admin v0.1
      </div>
    </aside>
  );
}
