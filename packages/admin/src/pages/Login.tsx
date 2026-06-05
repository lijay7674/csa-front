import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/admin';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请填写用户名和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login({ username, password });
      localStorage.setItem('csa-admin-token', res.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
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
              }}
              placeholder=""
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
              placeholder=""
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ background: 'var(--admin-accent)' }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
