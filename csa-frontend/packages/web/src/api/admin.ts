/**
 * 后台管理 API — /api/admin/*
 * 需 JWT token，由 client.ts 自动注入
 */
import { api } from './client';
import type {
  CsaContent, CsaMember, CsaCadre, CsaEvent,
  CsaCompetition, CsaCompetitionAward, CsaRegistration,
  CsaQuestionBank, CsaAttachment,
  LoginRequest, LoginResponse,
  GenerateRequest, PolishRequest,
} from '@csa/shared';

// ---- Auth ----
export function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post('/api/admin/auth/login', data);
}

export function getCurrentUser(): Promise<string> {
  return api.get('/api/admin/auth/me');
}

// ---- Content ----
export function fetchAdminContents(params?: {
  page?: number; size?: number; category?: string; status?: string; keyword?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaContent>(`/api/admin/contents?${qs}`);
}

export function fetchAdminContent(id: number): Promise<CsaContent> {
  return api.get(`/api/admin/contents/${id}`);
}

export function createContent(data: Partial<CsaContent>): Promise<CsaContent> {
  return api.post('/api/admin/contents', data);
}

export function updateContent(id: number, data: Partial<CsaContent>): Promise<CsaContent> {
  return api.put(`/api/admin/contents/${id}`, data);
}

export function deleteContent(id: number): Promise<void> {
  return api.delete(`/api/admin/contents/${id}`);
}

export function submitForReview(id: number): Promise<void> {
  return api.post(`/api/admin/contents/${id}/submit-review`);
}

export function approveContent(id: number, comment?: string): Promise<void> {
  return api.post(`/api/admin/contents/${id}/approve`, { comment });
}

export function rejectContent(id: number, comment?: string): Promise<void> {
  return api.post(`/api/admin/contents/${id}/reject`, { comment });
}

// ---- Members ----
export function fetchAdminMembers(params?: {
  page?: number; size?: number; cohort?: string; major?: string; status?: string; keyword?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaMember>(`/api/admin/members?${qs}`);
}

export function fetchAdminMember(id: number): Promise<CsaMember> {
  return api.get(`/api/admin/members/${id}`);
}

export function createMember(data: Partial<CsaMember>): Promise<CsaMember> {
  return api.post('/api/admin/members', data);
}

export function updateMember(id: number, data: Partial<CsaMember>): Promise<void> {
  return api.put(`/api/admin/members/${id}`, data);
}

export function deleteMember(id: number): Promise<void> {
  return api.delete(`/api/admin/members/${id}`);
}

export function updateMemberStatus(id: number, status: string): Promise<void> {
  return api.put(`/api/admin/members/${id}/status`, { status });
}

// ---- Cadres ----
export function fetchCadres(memberId?: number) {
  const qs = memberId ? `memberId=${memberId}` : '';
  return api.get<CsaCadre[]>(`/api/admin/members/cadres?${qs}`);
}

export function createCadre(data: Partial<CsaCadre>): Promise<CsaCadre> {
  return api.post('/api/admin/members/cadres', data);
}

export function updateCadre(id: number, data: Partial<CsaCadre>): Promise<void> {
  return api.put(`/api/admin/members/cadres/${id}`, data);
}

export function deleteCadre(id: number): Promise<void> {
  return api.delete(`/api/admin/members/cadres/${id}`);
}

// ---- Events ----
export function fetchAdminEvents(params?: {
  page?: number; size?: number; eventType?: string; status?: string; keyword?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaEvent>(`/api/admin/events?${qs}`);
}

export function fetchAdminEvent(id: number): Promise<CsaEvent> {
  return api.get(`/api/admin/events/${id}`);
}

export function createEvent(data: Partial<CsaEvent>): Promise<CsaEvent> {
  return api.post('/api/admin/events', data);
}

export function updateEvent(id: number, data: Partial<CsaEvent>): Promise<CsaEvent> {
  return api.put(`/api/admin/events/${id}`, data);
}

export function deleteEvent(id: number): Promise<void> {
  return api.delete(`/api/admin/events/${id}`);
}

// ---- Competitions ----
export function fetchAdminCompetitions(params?: {
  page?: number; size?: number; level?: string; compType?: string; year?: number; status?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaCompetition>(`/api/admin/competitions?${qs}`);
}

export function fetchAdminCompetition(id: number): Promise<CsaCompetition> {
  return api.get(`/api/admin/competitions/${id}`);
}

export function createCompetition(data: Partial<CsaCompetition>): Promise<CsaCompetition> {
  return api.post('/api/admin/competitions', data);
}

export function updateCompetition(id: number, data: Partial<CsaCompetition>): Promise<CsaCompetition> {
  return api.put(`/api/admin/competitions/${id}`, data);
}

export function deleteCompetition(id: number): Promise<void> {
  return api.delete(`/api/admin/competitions/${id}`);
}

// Awards
export function fetchCompetitionAwards(competitionId: number): Promise<CsaCompetitionAward[]> {
  return api.get(`/api/admin/competitions/${competitionId}/awards`);
}

export function createAward(data: Partial<CsaCompetitionAward>): Promise<CsaCompetitionAward> {
  return api.post('/api/admin/competitions/awards', data);
}

export function updateAward(id: number, data: Partial<CsaCompetitionAward>): Promise<void> {
  return api.put(`/api/admin/competitions/awards/${id}`, data);
}

export function deleteAward(id: number): Promise<void> {
  return api.delete(`/api/admin/competitions/awards/${id}`);
}

// ---- Registrations ----
export function fetchAdminRegistrations(params?: {
  page?: number; size?: number; targetType?: string; targetId?: number;
  status?: string; keyword?: string; regType?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaRegistration>(`/api/admin/registrations?${qs}`);
}

export function fetchAdminRegistration(id: number): Promise<CsaRegistration> {
  return api.get(`/api/admin/registrations/${id}`);
}

export function updateRegistrationStatus(id: number, status: string): Promise<void> {
  return api.put(`/api/admin/registrations/${id}/status`, { status });
}

export function addContactRecord(id: number, record: string): Promise<void> {
  return api.put(`/api/admin/registrations/${id}/contact-record`, { record });
}

// ---- Question Bank ----
export function fetchAdminQuestionBanks(params?: {
  page?: number; size?: number; year?: number; category?: string; keyword?: string;
}) {
  const qs = buildQuery({ page: 1, size: 10, ...params });
  return api.getPage<CsaQuestionBank>(`/api/admin/question-bank?${qs}`);
}

export function fetchAdminQuestionBank(id: number): Promise<CsaQuestionBank> {
  return api.get(`/api/admin/question-bank/${id}`);
}

export function createQuestionBank(data: Partial<CsaQuestionBank>): Promise<CsaQuestionBank> {
  return api.post('/api/admin/question-bank', data);
}

export function updateQuestionBank(id: number, data: Partial<CsaQuestionBank>): Promise<CsaQuestionBank> {
  return api.put(`/api/admin/question-bank/${id}`, data);
}

export function deleteQuestionBank(id: number): Promise<void> {
  return api.delete(`/api/admin/question-bank/${id}`);
}

// Attachments
export function fetchAttachments(questionId: number): Promise<CsaAttachment[]> {
  return api.get(`/api/admin/question-bank/${questionId}/attachments`);
}

export function uploadAttachment(questionId: number, file: File): Promise<CsaAttachment> {
  const formData = new FormData();
  formData.append('file', file);
  // Note: uses native fetch because content-type is multipart
  return api.post(`/api/admin/question-bank/${questionId}/attachments`, formData);
}

export function deleteAttachment(attachmentId: number): Promise<void> {
  return api.delete(`/api/admin/question-bank/attachments/${attachmentId}`);
}

// ---- Statistics ----
export function fetchStatisticsOverview(): Promise<Record<string, number>> {
  return api.get('/api/admin/statistics/overview');
}

export function fetchStatisticsByEventType(): Promise<Record<string, number>> {
  return api.get('/api/admin/statistics/by-event-type');
}

export function fetchStatisticsByCompetition(): Promise<Record<string, number>> {
  return api.get('/api/admin/statistics/by-competition');
}

export function fetchStatisticsByCohort(): Promise<Record<string, number>> {
  return api.get('/api/admin/statistics/by-cohort');
}

// ---- AI ----
export function aiGenerate(data: GenerateRequest): Promise<Record<string, string>> {
  return api.post('/api/admin/ai/generate', data);
}

export function aiPolish(data: PolishRequest): Promise<Record<string, string>> {
  return api.post('/api/admin/ai/polish', data);
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
