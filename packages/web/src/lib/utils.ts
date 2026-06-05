/**
 * 轻量 classname 合并工具
 * 替代 clsx + tailwind-merge，零依赖
 */

type ClassValue = string | undefined | null | false | ClassValue[];

function twMerge(...classes: string[]): string {
  // 简单尾缀覆盖：后面的 tailwind 类覆盖前面的同名前缀类
  const map = new Map<string, string>();
  for (const cls of classes.join(' ').split(/\s+/).filter(Boolean)) {
    // 提取前缀（如 bg-red-500 → bg, p-4 → p）
    const prefix = cls.match(/^([a-z]+)-/)?.[1];
    if (prefix) {
      // 覆盖同名前缀的类
      for (const [k] of map) {
        if (k.startsWith(prefix + '-') || k === prefix) {
          map.delete(k);
        }
      }
    }
    map.set(cls, cls);
  }
  return Array.from(map.values()).join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    }
  }
  return twMerge(...classes);
}
