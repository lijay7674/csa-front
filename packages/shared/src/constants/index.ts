import type { ThemeInfo } from '../types';

export const THEMES: ThemeInfo[] = [
  { name: 'sakura', label: '樱粉', icon: '🌸' },
  { name: 'ocean', label: '深蓝', icon: '🌊' },
  { name: 'forest', label: '墨绿', icon: '🌿' },
  { name: 'sunset', label: '暖橘', icon: '🌅' },
];

// ---- 内容分类 — 匹配后端 CsaContent.category ----
export const CONTENT_CATEGORIES = [
  { key: 'news', label: '活动新闻' },
  { key: 'notice', label: '竞赛公告' },
  { key: 'tech', label: '技术资讯' },
  { key: 'recruitment', label: '招新内容' },
] as const;

export const NEWS_CATEGORIES = [
  { key: 'all', label: '全部' },
  ...CONTENT_CATEGORIES,
] as const;

// ---- 报名类型 — 匹配后端 CsaRegistration.regType ----
export const REG_TYPES = [
  { key: 'recruit', label: '招新报名' },
  { key: 'activity', label: '活动报名' },
  { key: 'competition', label: '竞赛报名' },
] as const;

/** 报名目标类型（对应后端 TargetType 枚举） */
export const TARGET_TYPES = {
  MEMBER: 'MEMBER',
  EVENT: 'EVENT',
  COMPETITION: 'COMPETITION',
} as const;
export type TargetType = (typeof TARGET_TYPES)[keyof typeof TARGET_TYPES];

/** 报名方式（对应后端 RegistrationMode 枚举） */
export const REG_MODES = {
  INDIVIDUAL: 'INDIVIDUAL',
  TEAM: 'TEAM',
} as const;
export type RegMode = (typeof REG_MODES)[keyof typeof REG_MODES];

// ---- 状态枚举 — 匹配后端业务状态 ----
export const CONTENT_STATUS = ['draft', 'ai_draft', 'pending_review', 'published', 'offline'] as const;
export const REG_STATUS = ['pending', 'approved', 'rejected', 'cancelled'] as const;
export const MEMBER_STATUS = ['active', 'cadre', 'graduated', 'left', 'archived'] as const;
export const COMPETITION_STATUS = ['enrolling', 'reviewing', 'confirmed', 'ongoing', 'finished'] as const;

// ---- 技术方向 ----
export const TECH_DIRECTIONS = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'algorithm', label: '算法竞赛' },
  { value: 'ai', label: 'AI / ML' },
  { value: 'design', label: 'UI 设计' },
  { value: 'other', label: '其他' },
];

export const PAGE_SIZE = 10;
