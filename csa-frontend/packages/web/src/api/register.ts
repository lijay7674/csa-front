/**
 * 报名 API 服务
 */

import type { RegistrationForm, RegistrationType } from '@csa/shared';
import { api } from './client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

interface RegisterResult {
  id: string;
  registrationNumber: string;
  status: string;
}

interface QueryResult {
  type: string;
  name: string;
  registrationNumber: string;
  status: string;
  reviewNote: string;
  contacted: boolean;
  submittedAt: string;
}

export async function submitRegistration(form: RegistrationForm): Promise<RegisterResult> {
  if (USE_MOCK) {
    // 模拟后端返回报名编号
    await new Promise(r => setTimeout(r, 800));
    return {
      id: String(Date.now()),
      registrationNumber: `CSA${Date.now().toString(36).toUpperCase().slice(-8)}`,
      status: 'pending',
    };
  }
  return api.post<RegisterResult>('/registrations', form);
}

export async function queryRegistration(params: {
  phone?: string;
  studentId?: string;
  registrationNumber?: string;
}): Promise<QueryResult | null> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    // Mock: 只对已知手机号返回结果
    if (params.phone === '13800138000') {
      return {
        type: 'recruit',
        name: '测试用户',
        registrationNumber: 'CSATEST001',
        status: 'pending',
        reviewNote: '正在审核中，请耐心等待',
        contacted: false,
        submittedAt: '2026-05-28 14:30',
      };
    }
    return null;
  }
  const search = new URLSearchParams();
  if (params.phone) search.set('phone', params.phone);
  if (params.studentId) search.set('studentId', params.studentId);
  if (params.registrationNumber) search.set('registrationNumber', params.registrationNumber);
  return api.get<QueryResult | null>(`/registrations/query?${search}`);
}
