// ================================================================
// 通用响应类型 — 匹配后端 R<T> 和 IPage<T> 包装
// ================================================================

/** 后端统一响应包装 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/** 后端分页响应 */
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// ================================================================
// 业务实体 — 与后端 DDL / OpenAPI schemas 字段一一对应
// ================================================================

/** 成员 */
export interface CsaMember {
  id: number;
  name: string;
  gender: number;
  cohort: string;
  major: string;
  className: string;
  studentId: string;
  phone: string;
  techDirection: string;
  joinDate: string;
  status: string;
  remark: string;
  isPublicDisplay: number;
  displayTitle: string;
  displayAchievement: string;
  displaySummary: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

/** 干部任职 */
export interface CsaCadre {
  id: number;
  memberId: number;
  cohort: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

/** 活动 */
export interface CsaEvent {
  id: number;
  title: string;
  eventType: string;
  startTime: string;
  endTime: string;
  location: string;
  contactPerson: string;
  description: string;
  regDeadline: string;
  status: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

/** 竞赛 */
export interface CsaCompetition {
  id: number;
  name: string;
  level: string;
  compType: string;
  year: number;
  organizer: string;
  regMethod: string;
  regDeadline: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** 竞赛获奖 */
export interface CsaCompetitionAward {
  id: number;
  competitionId: number;
  awardLevel: string;
  memberNames: string;
  advisor: string;
  summary: string;
  isPublicDisplay: number;
  createdAt: string;
  updatedAt: string;
}

/** 内容（新闻/公告/资讯/招新） */
export interface CsaContent {
  id: number;
  title: string;
  category: string;
  summary: string;
  body: string;
  coverImage: string;
  source: string;
  status: string;
  isAiGenerated: number;
  reviewComment: string;
  publishedAt: string;
  createdBy: number;
  reviewedBy: number;
  createdAt: string;
  updatedAt: string;
}

/** 报名记录 */
export interface CsaRegistration {
  id: number;
  regNo: string;
  targetType: string;
  targetId: number;
  regType: string;
  name: string;
  studentId: string;
  phone: string;
  teamName: string;
  teamMembers: string;
  extraInfo: string;
  submitTime: string;
  status: string;
  reviewComment: string;
  contactRecord: string;
  reviewedAt: string;
  reviewedBy: number;
  createdAt: string;
  updatedAt: string;
}

/** 题库 */
export interface CsaQuestionBank {
  id: number;
  title: string;
  year: number;
  category: string;
  source: string;
  description: string;
  copyrightNote: string;
  isPublic: number;
  createdAt: string;
  updatedAt: string;
}

/** 附件 */
export interface CsaAttachment {
  id: number;
  questionId: number;
  originalName: string;
  storedName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  downloadCount: number;
  createdAt: string;
}

// ================================================================
// 请求 DTO
// ================================================================

/** 登录 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

/** AI 生成 */
export interface GenerateRequest {
  prompt: string;
  style?: string;
}

export interface PolishRequest {
  content: string;
  style?: string;
}

// ================================================================
// 动态响应类型 — 公开 API 返回 Map<String,Object>，用 Record 兜底
// ================================================================

export type PublicPageData = Record<string, unknown>;

// ================================================================
// 报名表单 — 前端专用
// ================================================================

export type RegistrationType = 'recruit' | 'activity' | 'competition';
export type TeamMode = 'individual' | 'team';

export interface TeamMember {
  name: string;
  studentId: string;
}

export interface RegistrationForm {
  targetType: string;
  targetId: number;
  regType: string;
  name: string;
  studentId: string;
  phone: string;
  major?: string;
  direction?: string;
  teamName?: string;
  teamMembers?: TeamMember[];
  remark?: string;
}

// ================================================================
// 主题
// ================================================================

export type ThemeName = 'sakura' | 'ocean' | 'forest' | 'sunset';

export interface ThemeInfo {
  name: ThemeName;
  label: string;
  icon: string;
}
