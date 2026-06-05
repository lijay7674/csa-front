import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentApi } from '../api/admin';
import { DataTable, Toolbar, StatusBadge } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { ConfirmDialog, PromptDialog } from '../components/Modal';
import useAuth from '../hooks/useAuth';

const FILTERS = [
  { key: '', label: '全部', value: '' },
  { key: 'PENDING_REVIEW', label: '待审核', value: 'PENDING_REVIEW' },
  { key: 'DRAFT', label: '草稿', value: 'DRAFT' },
  { key: 'PUBLISHED', label: '已发布', value: 'PUBLISHED' },
  { key: 'ABOUT', label: '学会简介', value: 'ABOUT' },
];

export default function ContentList({ reviewMode }: { reviewMode?: boolean }) {
  const [data, setData] = useState({ records: [] as Record<string, unknown>[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState(reviewMode ? 'PENDING_REVIEW' : '');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin } = useAuth();

  const canEdit = hasPermission('content:write');
  const canReview = hasPermission('content:review');

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });

  // Reject dialog state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = () => {
    setLoading(true);
    contentApi.list({ page, size: 10, keyword: keyword || undefined, status: status || undefined })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, status]);

  const doAction = async (fn: () => Promise<unknown>) => {
    try { await fn(); } catch (e: unknown) { setError(e instanceof Error ? e.message : '操作失败'); return; }
    fetch();
    setActionLoading(null);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id', title: 'ID', width: '50px' },
    { key: 'title', title: '标题', render: r => <span className="font-medium">{String(r.title)}</span> },
    { key: 'category', title: '分类', render: r => <CategoryBadge cat={String(r.category)} /> },
    { key: 'status', title: '状态', render: r => <StatusBadge status={String(r.status)} /> },
    { key: 'createdAt', title: '时间', render: r => String(r.createdAt || '').slice(0, 10) },
    {
      key: 'actions', title: '操作', render: r => {
        const s = String(r.status);
        const id = Number(r.id);
        return (
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            {canEdit && <Btn label="编辑" onClick={() => navigate(`/content/${id}/edit`)} />}
            {canEdit && s === 'DRAFT' && <Btn label="提交审核" primary onClick={() => { setActionLoading(id); doAction(() => contentApi.submitReview(id)); }} />}
            {canEdit && s === 'PENDING_REVIEW' && !reviewMode && <Btn label="提交审核" disabled />}
            {canReview && reviewMode && s === 'PENDING_REVIEW' && (
              <>
                <Btn label="通过" success onClick={() => { setActionLoading(id); doAction(() => contentApi.approve(id)); }} />
                <Btn label="驳回" danger onClick={() => { setRejectId(id); setRejectOpen(true); }} />
              </>
            )}
            {canEdit && s === 'PUBLISHED' && <Btn label="下线" danger onClick={() => { setActionLoading(id); doAction(() => contentApi.offline(id)); }} />}
            {canEdit && <Btn label="删除" danger onClick={() => { setDeleteId(id); setConfirmState({ open: true, message: '确定删除？此操作不可恢复。', onOk: () => { doAction(() => contentApi.delete(id)); }, danger: true }); }} />}
            {actionLoading === id && <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>处理中...</span>}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>{reviewMode ? '内容审核' : '内容管理'}</h1>
        {!reviewMode && canEdit && (
          <button onClick={() => navigate('/content/new')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--admin-accent)' }}>
            + 新建内容
          </button>
        )}
      </div>
      <Toolbar
        searchPlaceholder="搜索标题..."
        searchValue={keyword}
        onSearchChange={v => { setKeyword(v); setPage(1); }}
        filters={FILTERS}
        activeFilter={status}
        onFilterChange={s => { setStatus(s); setPage(1); }}
        actions={<Btn label="刷新" onClick={fetch} />}
      />
      <DataTable columns={columns} data={data.records} loading={loading} error={error}
        total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无内容"
        keyField="id" />

      {/* 删除确认弹窗 */}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />

      {/* 驳回理由弹窗 */}
      <PromptDialog open={rejectOpen} title="驳回内容" label="请输入驳回理由：" placeholder="填写驳回原因..."
        onConfirm={(comment) => { if (comment && rejectId) { setActionLoading(rejectId); doAction(() => contentApi.reject(rejectId, comment)); } setRejectOpen(false); setRejectId(null); }}
        onCancel={() => { setRejectOpen(false); setRejectId(null); }} />
    </div>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = { news: '新闻', notice: '公告', tech: '技术', recruitment: '招新', about: '学会简介' };
  return <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-secondary)' }}>{map[cat] || cat}</span>;
}

function Btn({ label, onClick, primary, success, danger, disabled }: {
  label: string; onClick?: () => void; primary?: boolean; success?: boolean; danger?: boolean; disabled?: boolean;
}) {
  let bg = 'var(--admin-bg)';
  let color = 'var(--admin-text-secondary)';
  if (primary) { bg = 'var(--admin-accent)'; color = 'white'; }
  if (success) { bg = '#DCFCE7'; color = '#166534'; }
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  return (
    <button disabled={disabled} onClick={onClick}
      className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
      style={{ background: bg, color, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  );
}
