/**
 * API 客户端 — fetch 封装（零依赖，axios 风格 API）
 * 后端就绪后只需改 BASE_URL 即可切换
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

class ApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, timeout = 10000 } = config;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status);
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

// 请求方法快捷方式
export const api = {
  get: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'GET' }),
  post: <T>(url: string, body?: unknown, config?: RequestConfig) => request<T>(url, { ...config, method: 'POST', body }),
  put: <T>(url: string, body?: unknown, config?: RequestConfig) => request<T>(url, { ...config, method: 'PUT', body }),
  delete: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'DELETE' }),
};

export { ApiError };
export type { ApiResponse };
