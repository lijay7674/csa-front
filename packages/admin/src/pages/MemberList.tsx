import { useState, useEffect } from 'react';
import { memberApi } from '../api/admin';
import { DataTable, Toolbar, StatusBadge } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { ConfirmDialog } from '../components/Modal';
import useAuth from '../hooks/useAuth';

const STATUS_FILTERS = [
  { key: '', label: '全部', value: '' },
  { key: 'active', label: '活跃', value: 'active' },
  { key: 'graduated', label: '已毕业', value: 'graduated' },
  { key: 'left', label: '已离开', value: 'left' },
  { key: 'cadre', label: '干部', value: 'cadre' },
];

const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));

export default function MemberList() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('member:write');
  const [data, setData] = useState({ records: [] as Record<string, unknown>[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [cohortFilter, setCohortFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', studentId: '', cohort: '', major: '', phone: '', techDirection: '', status: 'active', isPublicDisplay: 0, displayTitle: '', displayAchievement: '', displaySummary: '' });
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });

  const fetch = () => {
    setLoading(true);
    memberApi.list({ page, size: 10, keyword: keyword || undefined, status: status || undefined, cohort: cohortFilter || undefined })
      .then(setData).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page, status, cohortFilter]);

  const openNew = () => { setEditId(null); setForm({ name: '', studentId: '', cohort: '', major: '', phone: '', techDirection: '', status: 'active', isPublicDisplay: 0, displayTitle: '', displayAchievement: '', displaySummary: '' }); setShowModal(true); };
  const openEdit = (row: Record<string, unknown>) => {
    setEditId(Number(row.id));
    setForm({ name: String(row.name || ''), studentId: String(row.studentId || ''), cohort: String(row.cohort || ''), major: String(row.major || ''), phone: String(row.phone || ''), techDirection: String(row.techDirection || ''), status: String(row.status || 'active'), isPublicDisplay: Number(row.isPublicDisplay) || 0, displayTitle: String(row.displayTitle || ''), displayAchievement: String(row.displayAchievement || ''), displaySummary: String(row.displaySummary || '') });
    setShowModal(true);
  };

  const saveMember = async () => {
    if (editId) {
      await memberApi.update(editId, form);
    } else {
      await memberApi.create(form);
    }
    setShowModal(false);
    fetch();
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id', title: 'ID', width: '50px' },
    { key: 'name', title: '姓名', render: r => <span className="font-medium">{String(r.name)}</span> },
    { key: 'studentId', title: '学号' },
    { key: 'cohort', title: '届别' },
    { key: 'major', title: '专业' },
    { key: 'techDirection', title: '技术方向', render: r => String(r.techDirection || '-') },
    { key: 'status', title: '状态', render: r => <StatusBadge status={String(r.status)} /> },
    { key: 'actions', title: '操作', render: r => (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {canManage && <Btn label="编辑" onClick={() => openEdit(r)} />}
          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该成员？此操作不可恢复。', onOk: () => { memberApi.delete(Number(r.id)).then(fetch); }, danger: true })} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>成员管理</h1>
        {canManage && <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增成员</button>}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <Toolbar searchPlaceholder="搜索姓名/学号..." searchValue={keyword}
            onSearchChange={v => { setKeyword(v); setPage(1); }} filters={STATUS_FILTERS} activeFilter={status}
            onFilterChange={s => { setStatus(s); setPage(1); }} actions={<Btn label="刷新" onClick={fetch} />} />
        </div>
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
          届别:
          <select className="admin-input text-xs py-1.5" style={{ width: 100 }}
            value={cohortFilter}
            onChange={e => { setCohortFilter(e.target.value); setPage(1); }}>
            <option value="">全部</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
      </div>
      <DataTable columns={columns} data={data.records} loading={loading} error={error}
        total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无成员" keyField="id" />

      {showModal && (
        <Modal title={editId ? '编辑成员' : '新增成员'} onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <ModalField label="姓名" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
            <ModalField label="学号" value={form.studentId} onChange={v => setForm(f => ({ ...f, studentId: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>届别</span>
                <select className="admin-input" value={form.cohort} onChange={e => setForm(f => ({ ...f, cohort: e.target.value }))}>
                  <option value="">请选择</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <ModalField label="专业" value={form.major} onChange={v => setForm(f => ({ ...f, major: v }))} />
            </div>
            <ModalField label="手机号" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <ModalField label="技术方向" value={form.techDirection} onChange={v => setForm(f => ({ ...f, techDirection: v }))} />
            <label className="block">
              <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>状态</span>
              <select className="admin-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">活跃</option>
                <option value="graduated">已毕业</option>
                <option value="left">已离开</option>
              </select>
            </label>
          </div>

          {/* 展示管理 */}
          <div className="border-t pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--admin-text)' }}>展示管理</h4>
            <label className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--admin-text)' }}>
              <input type="checkbox" checked={form.isPublicDisplay === 1}
                onChange={e => setForm(f => ({ ...f, isPublicDisplay: e.target.checked ? 1 : 0 }))} />
              公开展示到优秀成员页面
            </label>
            {form.isPublicDisplay === 1 && (
              <>
                <ModalField label="展示头衔" value={form.displayTitle}
                  onChange={v => setForm(f => ({ ...f, displayTitle: v }))} placeholder="如：前端负责人" />
                <ModalField label="成就/荣誉" value={form.displayAchievement}
                  onChange={v => setForm(f => ({ ...f, displayAchievement: v }))} placeholder="如：ACM金牌" />
                <label className="block">
                  <span className="text-xs font-semibold mb-1 mt-2 block" style={{ color: 'var(--admin-text)' }}>简介摘要</span>
                  <textarea className="admin-input min-h-[60px]" value={form.displaySummary}
                    onChange={e => setForm(f => ({ ...f, displaySummary: e.target.value }))} placeholder="简短的展示说明" />
                </label>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
            <button onClick={saveMember} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>保存</button>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>取消</button>
          </div>
        </Modal>
      )}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />
    </div>
  );
}

/* ---- 弹窗组件 ---- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 480 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>{title}</h3>
          <button onClick={onClose} className="text-xl" style={{ color: 'var(--admin-text-secondary)' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>{label}</span>
      <input className="admin-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Btn({ label, onClick, primary, danger }: { label: string; onClick?: () => void; primary?: boolean; danger?: boolean }) {
  let bg = 'var(--admin-bg)', color = 'var(--admin-text-secondary)';
  if (primary) { bg = 'var(--admin-accent)'; color = 'white'; }
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  return <button onClick={onClick} className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80" style={{ background: bg, color }}>{label}</button>;
}
