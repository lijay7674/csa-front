/**
 * 前台公开 API — /api/public/*
 * 无需认证，直接调用
 */
import { api } from './client';
import type { CsaContent, CsaRegistration, CsaQuestionBank, PublicPageData, RegistrationForm } from '@csa/shared';

// ---- 首页聚合 ----
export function fetchHomeData(): Promise<PublicPageData> {
  return api.get('/api/public/home');
}

// ---- 学会简介 ----
export function fetchAbout(): Promise<PublicPageData> {
  return api.get('/api/public/about');
}

// ---- 新闻 ----
export function fetchNewsList(params?: { page?: number; size?: number; category?: string }) {
  const qs = buildQuery(params || {});
  return api.getPage<CsaContent>(`/api/public/news?${qs}`);
}

export function fetchNewsDetail(id: number): Promise<CsaContent> {
  return api.get(`/api/public/news/${id}`);
}

// ---- 公告 ----
export function fetchNoticesList(params?: { page?: number; size?: number }) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaContent>(`/api/public/notices?${qs}`);
}

export function fetchNoticeDetail(id: number): Promise<CsaContent> {
  return api.get(`/api/public/notices/${id}`);
}

// ---- 优秀成员 ----
export function fetchMembersList(params?: { cohort?: string; page?: number; size?: number }) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<PublicPageData>(`/api/public/members?${qs}`);
}

export function fetchMemberCohorts(): Promise<string[]> {
  return api.get('/api/public/members/cohorts');
}

// ---- 题库 ----
export function fetchQuestionBankList(params?: {
  page?: number; size?: number; year?: number; category?: string; keyword?: string;
}) {
  const qs = buildQuery({ page: 1, size: 20, ...params });
  return api.getPage<CsaQuestionBank>(`/api/public/question-bank?${qs}`);
}

export function getAttachmentDownloadUrl(questionId: number, attachmentId: number): string {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
  return `${base}/api/public/question-bank/${questionId}/attachments/${attachmentId}/download`;
}

// ---- 报名 ----
export function submitRegistration(form: RegistrationForm): Promise<CsaRegistration> {
  return api.post('/api/public/registrations', form);
}

export function queryRegistration(params: { phone?: string; studentId?: string; regNo?: string }): Promise<CsaRegistration | null> {
  const qs = buildQuery(params);
  return api.get<CsaRegistration[]>(`/api/public/registrations/query?${qs}`).then(data => {
    return (Array.isArray(data) && data.length > 0) ? data[0] : null;
  });
}

// ---- 活动（公开） ----
export function fetchPublicEvents(params?: { page?: number; size?: number; eventType?: string; status?: string }) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<PublicPageData>(`/api/public/events?${qs}`);
}

export function fetchPublicEvent(id: number): Promise<PublicPageData> {
  return api.get(`/api/public/events/${id}`);
}

// ---- 竞赛（公开） ----
export function fetchPublicCompetitions(params?: { page?: number; size?: number; level?: string; compType?: string; year?: number; status?: string }) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<PublicPageData>(`/api/public/competitions?${qs}`);
}

export function fetchPublicCompetition(id: number): Promise<PublicPageData> {
  return api.get(`/api/public/competitions/${id}`);
}

// ================================================================
// 工具
// ================================================================
function buildQuery(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      sp.set(k, String(v));
    }
  }
  return sp.toString();
}
