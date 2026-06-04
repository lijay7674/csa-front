/**
 * API 客户端 — 对接后端 R<T> 响应格式
 *
 * 后端地址由环境变量 VITE_API_BASE 指定，开发默认 http://localhost:8080
 *
 * Public: /api/public/*
 * Admin:  /api/admin/*   (需 JWT token)
 *
 * 响应格式: { code: 0, message: "ok", data: T, timestamp: 1234567890 }
 * 分页格式: { records: [...], total: N, size: N, current: N, pages: N }
 */

import type { ApiResponse, PageResult } from '@csa/shared';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

// ---- Token 管理 ----
function getToken(): string | null {
  return localStorage.getItem('csa-admin-token');
}

// ---- 错误类 ----
export class ApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ---- 核心请求 ----
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    // 文件下载不解析 JSON
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/octet-stream') || ct.includes('application/pdf')) {
      return res as unknown as T;
    }

    const json: ApiResponse<T> = await res.json();

    if (json.code !== 0 && json.code !== 200) {
      throw new ApiError(json.message || '请求失败', json.code);
    }

    return json.data;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('请求超时', 408);
    }
    throw new ApiError(`网络错误: ${String(err)}`, 0);
  }
}

// ---- 请求方法 ----
export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  put: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),

  /** 分页请求 — 解包 PageResult */
  getPage: async <T>(url: string): Promise<PageResult<T>> => {
    return request<PageResult<T>>(url);
  },
};
