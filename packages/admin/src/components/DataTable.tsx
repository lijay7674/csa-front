import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ================================================================
// 通用列定义
// ================================================================
export interface Column<T> {
  key: string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

// ================================================================
// 通用数据表格
// ================================================================
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyText?: string;
  keyField?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, loading, error, total, page, pageSize, onPageChange, onRowClick, emptyText = '暂无数据', keyField = 'id',
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-16" style={{ color: 'var(--admin-text-secondary)' }}>{emptyText}</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--admin-border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold"
                  style={{ color: 'var(--admin-text-secondary)', width: col.width }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: 'var(--admin-card)' }}>
            {data.map(row => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={`border-t transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--admin-accent-light)]' : ''}`}
                style={{ borderColor: 'var(--admin-border)' }}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3" style={{ color: 'var(--admin-text)' }}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
          <span>共 {total} 条</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 :
                i < 3 ? i + 1 : i === 3 ? '...' : totalPages - (6 - i);
              if (p === '...') return <span key={i} className="px-2">...</span>;
              const num = p as number;
              return (
                <button key={i} onClick={() => onPageChange(num)}
                  className={`w-8 h-8 rounded text-sm ${num === page ? 'text-white' : ''}`}
                  style={num === page ? { background: 'var(--admin-accent)' } : { color: 'var(--admin-text-secondary)' }}>
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================================
// 工具条（搜索+筛选）
// ================================================================
interface ToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  filters?: { key: string; label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (key: string) => void;
  actions?: React.ReactNode;
}

export function Toolbar({ searchPlaceholder = '搜索...', searchValue, onSearchChange, filters, activeFilter, onFilterChange, actions }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1 h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
        style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-card)', color: 'var(--admin-text)' }}
      />
      {filters && (
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => onFilterChange?.(f.key === activeFilter ? '' : f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                f.key === activeFilter ? 'text-white' : ''
              }`}
              style={f.key === activeFilter ? { background: 'var(--admin-accent)' }
                : { background: 'var(--admin-bg)', color: 'var(--admin-text-secondary)' }}>
              {f.label}
            </button>
          ))}
        </div>
      )}
      {actions}
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-6 h-6 border-2 rounded-full animate-spin"
      style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }} />
  );
}

// ================================================================
// 状态徽章（后台专用）
// ================================================================
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    DRAFT: { bg: '#F1F5F9', color: '#475569', label: '草稿' },
    AI_DRAFT: { bg: '#FEF3C7', color: '#92400E', label: 'AI草稿' },
    PENDING_REVIEW: { bg: '#FEF3C7', color: '#92400E', label: '待审核' },
    PENDING: { bg: '#FEF3C7', color: '#92400E', label: '待审核' },
    PUBLISHED: { bg: '#DCFCE7', color: '#166534', label: '已发布' },
    OFFLINE: { bg: '#FEE2E2', color: '#991B1B', label: '已下线' },
    APPROVED: { bg: '#DCFCE7', color: '#166534', label: '已通过' },
    REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: '已拒绝' },
    ACTIVE: { bg: '#DCFCE7', color: '#166534', label: '活跃' },
    GRADUATED: { bg: '#E0E7FF', color: '#3730A3', label: '已毕业' },
    ENROLLING: { bg: '#DCFCE7', color: '#166534', label: '报名中' },
    ONGOING: { bg: '#DBEAFE', color: '#1E40AF', label: '进行中' },
    FINISHED: { bg: '#F1F5F9', color: '#475569', label: '已结束' },
  };
  const s = map[status] || { bg: '#F1F5F9', color: '#475569', label: status };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}
