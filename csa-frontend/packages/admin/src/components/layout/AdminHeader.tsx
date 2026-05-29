import { useNavigate } from 'react-router-dom';

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('csa-admin-token');
    navigate('/login', { replace: true });
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{
        background: 'var(--admin-header)',
        borderColor: 'var(--admin-border)',
      }}
    >
      {/* Left: breadcrumb placeholder */}
      <div className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
        CSA 后台管理系统
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--admin-accent-light)', color: 'var(--admin-accent)' }}
          >
            管
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
            管理员
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-red-50 hover:text-red-600"
          style={{ color: 'var(--admin-text-secondary)' }}
        >
          退出
        </button>
      </div>
    </header>
  );
}
