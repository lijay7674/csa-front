/**
 * Admin API — 完整 CRUD
 * 后端统一响应: { code: 0/200, data: T, message: string }
 * 所有 /api/admin/** 自动带 Bearer token
 */
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

interface Page<T> { records: T[]; total: number; size: number; current: number; pages: number; }
type Row = Record<string, unknown>;

async function get<T>(url: string): Promise<T> {
  const token = localStorage.getItem('csa-admin-token');
  const res = await fetch(`${BASE}${url}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) throw new Error(json.message || '请求失败');
  return json.data;
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('csa-admin-token');
  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) throw new Error(json.message || '请求失败');
  return json.data;
}

async function put<T>(url: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('csa-admin-token');
  const res = await fetch(`${BASE}${url}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) throw new Error(json.message || '请求失败');
  return json.data;
}

async function del(url: string): Promise<void> {
  const token = localStorage.getItem('csa-admin-token');
  const res = await fetch(`${BASE}${url}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) throw new Error(json.message || '请求失败');
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  return sp.toString();
}

// ================================================================
// Auth
// ================================================================
export function login(data: { username: string; password: string }) {
  return post<{ token: string; username: string }>('/api/admin/auth/login', data);
}

export function me() {
  return get<{ username: string; authorities: string[] }>('/api/admin/auth/me');
}

// ================================================================
// Content  `/api/admin/contents`
// ================================================================
export const contentApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/contents?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/contents/${id}`),
  create: (data: Row) => post<Row>('/api/admin/contents', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/contents/${id}`, data),
  delete: (id: number) => del(`/api/admin/contents/${id}`),
  submitReview: (id: number) => post<void>(`/api/admin/contents/${id}/submit-review`),
  approve: (id: number, comment?: string) => post<void>(`/api/admin/contents/${id}/approve`, { comment }),
  reject: (id: number, comment: string) => post<void>(`/api/admin/contents/${id}/reject`, { comment }),
  offline: (id: number) => post<void>(`/api/admin/contents/${id}/offline`),
};

// ================================================================
// Member  `/api/admin/members`
// ================================================================
export const memberApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/members?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/members/${id}`),
  create: (data: Row) => post<Row>('/api/admin/members', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/members/${id}`, data),
  delete: (id: number) => del(`/api/admin/members/${id}`),
  updateStatus: (id: number, status: string) => put<void>(`/api/admin/members/${id}/status`, { status }),
};

// ================================================================
// Cadre  `/api/admin/cadres`（注意：不是 /members/cadres）
// ================================================================
export const cadreApi = {
  list: (p?: { memberId?: number; cohort?: string }) => get<Row[]>(`/api/admin/cadres?${qs(p || {})}`),
  create: (data: Row) => post<Row>('/api/admin/cadres', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/cadres/${id}`, data),
  delete: (id: number) => del(`/api/admin/cadres/${id}`),
};

// ================================================================
// Event  `/api/admin/events`
// ================================================================
export const eventApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/events?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/events/${id}`),
  create: (data: Row) => post<Row>('/api/admin/events', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/events/${id}`, data),
  delete: (id: number) => del(`/api/admin/events/${id}`),
  publish: (id: number) => put<void>(`/api/admin/events/${id}/publish`),
  finish: (id: number) => put<void>(`/api/admin/events/${id}/finish`),
};

// ================================================================
// Competition  `/api/admin/competitions`
// ================================================================
export const competitionApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/competitions?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/competitions/${id}`),
  create: (data: Row) => post<Row>('/api/admin/competitions', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/competitions/${id}`, data),
  delete: (id: number) => del(`/api/admin/competitions/${id}`),
  publish: (id: number) => put<void>(`/api/admin/competitions/${id}/publish`),
  finish: (id: number) => put<void>(`/api/admin/competitions/${id}/finish`),
  awards: {
    list: (competitionId: number) => get<Row[]>(`/api/admin/competitions/${competitionId}/awards`),
    create: (competitionId: number, data: Row) => post<Row>(`/api/admin/competitions/${competitionId}/awards`, data),
    update: (competitionId: number, id: number, data: Row) => put<Row>(`/api/admin/competitions/${competitionId}/awards/${id}`, data),
    delete: (competitionId: number, id: number) => del(`/api/admin/competitions/${competitionId}/awards/${id}`),
  },
};

// ================================================================
// Registration  `/api/admin/registrations`
// ================================================================
export const registrationApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/registrations?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/registrations/${id}`),
  updateStatus: (id: number, status: string, comment?: string) => put<void>(`/api/admin/registrations/${id}/status`, { status, comment }),
  addContactRecord: (id: number, method: string, note: string) => put<void>(`/api/admin/registrations/${id}/contact-record`, { method, note }),
};

// ================================================================
// Question Bank  `/api/admin/question-bank`
// ================================================================
export const questionBankApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/question-bank?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/question-bank/${id}`),
  create: (data: Row) => post<Row>('/api/admin/question-bank', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/question-bank/${id}`, data),
  delete: (id: number) => del(`/api/admin/question-bank/${id}`),
  attachments: {
    list: (questionId: number) => get<Row[]>(`/api/admin/question-bank/${questionId}/attachments`),
    upload: async (questionId: number, file: File) => {
      const token = localStorage.getItem('csa-admin-token');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${BASE}/api/admin/question-bank/${questionId}/attachments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await res.json();
      if (json.code !== 0 && json.code !== 200) throw new Error(json.message || '上传失败');
      return json.data;
    },
    delete: (attachmentId: number) => del(`/api/admin/question-bank/attachments/${attachmentId}`),
  },
};

// ================================================================
// AI  `/api/admin/ai`
// ================================================================
export const aiApi = {
  generate: (prompt: string, style?: string) => post<Record<string, string>>('/api/admin/ai/generate', { prompt, style }),
  polish: (content: string, style?: string) => post<Record<string, string>>('/api/admin/ai/polish', { content, style }),
};

// ================================================================
// Statistics
// ================================================================
export function fetchOverview() {
  return get<Record<string, number>>('/api/admin/statistics/overview');
}

/** 按活动类型统计报名人次 */
export function fetchStatisticsByEventTypeRegistrations() {
  return get<Record<string, number>>('/api/admin/statistics/by-event-type-registrations');
}

// ================================================================
// User & Role  `/api/admin/users` + `/api/admin/roles`
// ================================================================
export const userApi = {
  list: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/admin/users?${qs({ page: 1, size: 10, ...p })}`),
  get: (id: number) => get<Row>(`/api/admin/users/${id}`),
  create: (data: Row) => post<Row>('/api/admin/users', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/users/${id}`, data),
  delete: (id: number) => del(`/api/admin/users/${id}`),
  updateStatus: (id: number, status: number) => put<void>(`/api/admin/users/${id}/status`, { status }),
  assignRoles: (id: number, roleIds: number[]) => put<void>(`/api/admin/users/${id}/roles`, { roleIds }),
};

export const roleApi = {
  list: () => get<Row[]>('/api/admin/roles'),
  get: (id: number) => get<Row>(`/api/admin/roles/${id}`),
  create: (data: Row) => post<Row>('/api/admin/roles', data),
  update: (id: number, data: Row) => put<Row>(`/api/admin/roles/${id}`, data),
  delete: (id: number) => del(`/api/admin/roles/${id}`),
};

// ================================================================
// Public API (前台公开接口)
// ================================================================
export const publicApi = {
  getResults: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/public/results?${qs(p || {})}`),
  getMembers: (p?: Record<string, unknown>) => get<Page<Row>>(`/api/public/members?${qs(p || {})}`),
  getMemberCohorts: () => get<string[]>('/api/public/members/cohorts'),
};
