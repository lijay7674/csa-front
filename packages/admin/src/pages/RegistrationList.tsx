import { useState, useEffect } from 'react';
import { registrationApi } from '../api/admin';
import { DataTable, Toolbar, StatusBadge } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { PromptDialog } from '../components/Modal';
import useAuth from '../hooks/useAuth';

const FILTERS = [
  { key: '', label: '全部', value: '' },
  { key: 'PENDING', label: '待审核', value: 'PENDING' },
  { key: 'APPROVED', label: '已通过', value: 'APPROVED' },
  { key: 'REJECTED', label: '已拒绝', value: 'REJECTED' },
];

export default function RegistrationList() {
  const [data, setData] = useState({ records: [] as Record<string, unknown>[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const { hasPermission, isSuperAdmin } = useAuth();
  const canReview = hasPermission('registration:write');

  // Reject dialog
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);

  // Contact record dialog
  const [contactOpen, setContactOpen] = useState(false);
  const [contactId, setContactId] = useState<number | null>(null);
  const [contactMethod, setContactMethod] = useState('电话');
  const [contactNote, setContactNote] = useState('');

  const fetch = () => {
    setLoading(true);
    registrationApi.list({ page, size: 10, keyword: keyword || undefined, status: status || undefined })
      .then(setData).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page, status]);

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'regNo', title: '编号', render: r => <span className="font-mono text-xs">{String(r.regNo)}</span> },
    { key: 'name', title: '姓名', render: r => <span className="font-medium">{String(r.name)}</span> },
    { key: 'regType', title: '类型', render: r => <Chip v={String(r.regType)} /> },
    { key: 'phone', title: '手机号' },
    { key: 'status', title: '状态', render: r => <StatusBadge status={String(r.status)} /> },
    { key: 'submitTime', title: '提交时间', render: r => String(r.submitTime || '').slice(0, 16).replace('T', ' ') },
    { key: 'actions', title: '操作', render: r => {
        const s = String(r.status);
        const id = Number(r.id);
        return (
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            {canReview && s === 'PENDING' && (
              <>
                <Btn label="通过" success onClick={() => registrationApi.updateStatus(id, 'APPROVED').then(fetch)} />
                <Btn label="拒绝" danger onClick={() => { setRejectId(id); setRejectOpen(true); }} />
              </>
            )}
            {canReview && <Btn label="联系记录" onClick={() => { setContactId(id); setContactMethod('电话'); setContactNote(''); setContactOpen(true); }} />}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--admin-text)' }}>报名管理</h1>
      <Toolbar searchPlaceholder="搜索姓名/手机号..." searchValue={keyword}
        onSearchChange={v => { setKeyword(v); setPage(1); }} filters={FILTERS} activeFilter={status}
        onFilterChange={s => { setStatus(s); setPage(1); }} actions={<BtnL onClick={fetch} />} />
      <DataTable columns={columns} data={data.records} loading={loading} error={error}
        total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无报名" keyField="id" />

      {/* 拒绝理由弹窗 */}
      <PromptDialog open={rejectOpen} title="拒绝报名" label="请输入拒绝理由：" placeholder="填写拒绝原因..."
        onConfirm={(comment) => { if (comment && rejectId) { registrationApi.updateStatus(rejectId, 'REJECTED', comment).then(fetch); } setRejectOpen(false); setRejectId(null); }}
        onCancel={() => { setRejectOpen(false); setRejectId(null); }} />

      {/* 联系记录弹窗 */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setContactOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">添加联系记录</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm mb-1.5 block" style={{ color: 'var(--admin-text)' }}>联系方式</span>
                <select className="admin-input" value={contactMethod} onChange={e => setContactMethod(e.target.value)}>
                  <option value="电话">电话</option>
                  <option value="微信">微信</option>
                  <option value="短信">短信</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm mb-1.5 block" style={{ color: 'var(--admin-text)' }}>联系备注</span>
                <textarea className="admin-input min-h-[80px]" value={contactNote} onChange={e => setContactNote(e.target.value)} placeholder="联系内容和结果..." />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setContactOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>取消</button>
              <button onClick={() => { if (contactMethod && contactNote && contactId) { registrationApi.addContactRecord(contactId, contactMethod, contactNote).then(fetch); } setContactOpen(false); setContactId(null); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>提交</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ v }: { v: string }) {
  const m: Record<string, string> = { recruit: '招新', activity: '活动', competition: '竞赛' };
  return <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-secondary)' }}>{m[v] || v}</span>;
}

function BtnL({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-secondary)' }}>刷新</button>;
}

function Btn({ label, onClick, success, danger }: { label: string; onClick?: () => void; success?: boolean; danger?: boolean }) {
  let bg = 'var(--admin-bg)', color = 'var(--admin-text-secondary)';
  if (success) { bg = '#DCFCE7'; color = '#166534'; }
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  return <button onClick={onClick} className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80" style={{ background: bg, color }}>{label}</button>;
}
