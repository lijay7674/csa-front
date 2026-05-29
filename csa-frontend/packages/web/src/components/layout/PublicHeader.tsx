import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '@csa/shared';

const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/about', label: '学会简介' },
  { to: '/news', label: '活动新闻' },
  { to: '/competition/results', label: '竞赛成果' },
  { to: '/members', label: '优秀成员' },
  { to: '/register', label: '报名中心' },
];

export default function PublicHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className="sticky top-0 z-[1000] border-b backdrop-blur-xl transition-[background,border-color] duration-500"
      style={{
        background: 'var(--bg-nav)',
        borderColor: 'var(--border-light)',
        WebkitBackdropFilter: 'var(--nav-blur)',
      }}
    >
      <div className="flex items-center justify-between h-16 w-full max-w-[96vw] mx-auto px-8">
        {/* Left: Logo + Slogan */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <Link to="/" className="flex items-center gap-2 font-mono text-xl font-bold" style={{ color: 'var(--accent)' }}>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}
            >
              &lt;/&gt;
            </span>
            CSA
          </Link>
          <span
            className="hidden md:block font-mono text-xs border-l pl-3 whitespace-nowrap opacity-70"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
          >
            // Code the Future
          </span>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-7">
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative text-sm font-medium pb-1 transition-colors ${
                      isActive ? '' : ''
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className="absolute bottom-[-2px] left-0 h-0.5 transition-all duration-300"
                        style={{
                          background: 'var(--accent)',
                          width: isActive ? '100%' : '0',
                        }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Theme + User */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <div className="flex gap-1.5 items-center">
            {THEMES.map(t => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                title={t.label}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-115 ${
                  theme === t.name ? 'shadow-[0_0_0_3px_var(--accent-glow)]' : 'border-transparent'
                }`}
                style={{
                  borderColor: theme === t.name ? 'var(--accent)' : 'transparent',
                  background: t.name === 'sakura' ? 'linear-gradient(135deg, #FAD1DD, #F08CAE)' :
                              t.name === 'ocean'  ? 'linear-gradient(135deg, #1A3A5C, #4FC3F7)' :
                              t.name === 'forest' ? 'linear-gradient(135deg, #D4E8D0, #5B8C5A)' :
                              'linear-gradient(135deg, #FFD4C0, #FF7B42)',
                }}
                aria-label={`切换到${t.label}主题`}
              />
            ))}
          </div>
          <span className="hidden md:inline text-xs" style={{ color: 'var(--text-muted)' }}>
            {THEMES.find(t => t.name === theme)?.label}
          </span>

          {/* User area placeholder */}
          <button
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed cursor-pointer transition-all"
            style={{ borderColor: 'var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = ''; }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}
            >
              👤
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>登录</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
