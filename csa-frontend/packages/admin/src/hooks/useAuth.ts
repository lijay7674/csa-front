import { useState, useEffect, useCallback } from 'react';

const BASE = 'http://localhost:8080';
const CACHE_KEY = 'csa-admin-auth';

interface AuthState {
  username: string;
  realName: string;
  authorities: string[];
}

let cachedAuth: AuthState | null = null;
let authPromise: Promise<AuthState> | null = null;

async function fetchAuth(): Promise<AuthState> {
  if (cachedAuth) return cachedAuth;

  if (authPromise) return authPromise;

  const token = localStorage.getItem('csa-admin-token');

  authPromise = fetch(`${BASE}/api/admin/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 0 || json.code === 200) {
        const data: AuthState = json.data;
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        cachedAuth = data;
        return data;
      }
      throw new Error(json.message || '获取用户信息失败');
    })
    .catch((err) => {
      authPromise = null;
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached) as AuthState;
      throw err;
    });

  return authPromise;
}

export default function useAuth() {
  const cached = (() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? (JSON.parse(raw) as AuthState) : null;
    } catch {
      return null;
    }
  })();

  const [auth, setAuth] = useState<AuthState>(
    cached || { username: '', realName: '', authorities: [] },
  );

  useEffect(() => {
    let cancelled = false;
    fetchAuth()
      .then((data) => {
        if (!cancelled) setAuth(data);
      })
      .catch(() => {
        // auth remains at whatever we had (cached or empty)
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasPermission = useCallback(
    (perm: string): boolean => {
      return Array.isArray(auth.authorities) && auth.authorities.includes(perm);
    },
    [auth.authorities],
  );

  const isSuperAdmin = hasPermission('user:manage');

  return {
    username: auth.username,
    displayName: auth.realName || auth.username,
    authorities: auth.authorities,
    hasPermission,
    isSuperAdmin,
  };
}
