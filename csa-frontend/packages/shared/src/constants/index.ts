import type { ThemeInfo } from '../types';

export const THEMES: ThemeInfo[] = [
  { name: 'sakura', label: '樱粉', icon: '🌸' },
  { name: 'ocean', label: '深蓝', icon: '🌊' },
  { name: 'forest', label: '墨绿', icon: '🌿' },
  { name: 'sunset', label: '暖橘', icon: '🌅' },
];

export const NEWS_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'tech', label: '技术讲座' },
  { key: 'competition', label: '竞赛培训' },
  { key: 'activity', label: '团建活动' },
  { key: 'other', label: '其他' },
] as const;

export const PAGE_SIZE = 6;

export const TECH_DIRECTIONS = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'algorithm', label: '算法竞赛' },
  { value: 'ai', label: 'AI / ML' },
  { value: 'design', label: 'UI 设计' },
  { value: 'other', label: '其他' },
];
