import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请填写用户名和密码');
      return;
    }
    // TODO: 对接真实登录 API
    // 临时：写死 admin/admin
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('csa-admin-token', 'mock-token');
      navigate('/', { replace: true });
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--admin-bg)' }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl shadow-lg"
        style={{ background: 'var(--admin-card)' }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>
            CSA 后台管理
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-secondary)' }}>
            请登录以继续
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text)' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors"
              style={{
                borderColor: 'var(--admin-border)',
                background: 'var(--admin-bg)',
                color: 'var(--admin-text)',
                /* ring color inline */
              }}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--admin-text)' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors"
              style={{
                borderColor: 'var(--admin-border)',
                background: 'var(--admin-bg)',
                color: 'var(--admin-text)',
              }}
              placeholder="admin"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full h-10 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--admin-accent)' }}
          >
            登录
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: 'var(--admin-text-secondary)' }}>
          初始账号: admin / admin
        </p>
      </div>
    </div>
  );
}
