// ---- News / Article ----
export interface Article {
  id: number;
  tag: string;
  tagLabel: string;
  title: string;
  excerpt: string;
  date: string;
  source: string;
  location: string;
  body: string;
}

// ---- Registration ----
export type RegistrationType = 'recruit' | 'activity' | 'competition';
export type TeamMode = 'individual' | 'team';

export interface TeamMember {
  name: string;
  studentId: string;
}

export interface RegistrationForm {
  type: RegistrationType;
  name: string;
  studentId: string;
  phone: string;
  major?: string;
  className?: string;
  direction?: string;
  teamName?: string;
  teamMembers?: TeamMember[];
  activityId?: string;
  competitionId?: string;
  remark?: string;
}

// ---- Theme ----
export type ThemeName = 'sakura' | 'ocean' | 'forest' | 'sunset';

export interface ThemeInfo {
  name: ThemeName;
  label: string;
  icon: string;
}
