import { useState, useEffect } from 'react';
import { cadreApi, memberApi } from '../api/admin';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { ConfirmDialog } from '../components/Modal';
import useAuth from '../hooks/useAuth';

const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));

export default function CadreList() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('cadre:write');
  const [data, setData] = useState([] as Record<string, unknown>[]);
  const [members, setMembers] = useState([] as Record<string, unknown>[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ memberId: '', position: '', cohort: '', startDate: '', endDate: '', remark: '' });
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });

  const fetch = () => { setLoading(true); cadreApi.list({}).then(setData).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); };
  const fetchMembers = () => { memberApi.list({ size: 9999 }).then((res: { records: Record<string, unknown>[] }) => setMembers(res.records || [])).catch(() => {}); };

  useEffect(() => { fetch(); fetchMembers(); }, []);

  const openNew = () => { setEditId(null); setForm({ memberId: '', position: '', cohort: '', startDate: '', endDate: '', remark: '' }); setShowModal(true); };
  const openEdit = (r: Record<string, unknown>) => {
    setEditId(Number(r.id));
    setForm({ memberId: String(r.memberId || ''), position: String(r.position || ''), cohort: String(r.cohort || ''), startDate: String(r.startDate || ''), endDate: String(r.endDate || ''), remark: String(r.remark || '') });
    setShowModal(true);
  };
  const save = async () => { if (editId) { await cadreApi.update(editId, form); } else { await cadreApi.create(form); } setShowModal(false); fetch(); };

  /** Resolve memberId to display name */
  const memberName = (memberId: unknown): string => {
    const m = members.find(mb => String(mb.id) === String(memberId));
    return m ? `${String(m.name || '')} (${memberId})` : String(memberId || '');
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'id', title: 'ID', width: '50px' },
    { key: 'memberId', title: '成员', render: r => memberName(r.memberId) },
    { key: 'position', title: '职务' },
    { key: 'cohort', title: '届别' },
    { key: 'startDate', title: '任期开始' },
    { key: 'actions', title: '操作', render: r => (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {canManage && <Btn label="编辑" onClick={() => openEdit(r)} />}
          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该任职记录？', onOk: () => { cadreApi.delete(Number(r.id)).then(fetch); }, danger: true })} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>干部任职</h1>
        {canManage && <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增任职</button>}
      </div>
      <DataTable columns={columns} data={data} loading={loading} error={error} total={data.length} page={1} pageSize={data.length} onPageChange={() => {}} emptyText="暂无干部" keyField="id" />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 480 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>{editId ? '编辑任职' : '新增任职'}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl" style={{ color: 'var(--admin-text-secondary)' }}>×</button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>成员</span>
                <select className="admin-input" value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}>
                  <option value="">请选择成员</option>
                  {members.map(m => (
                    <option key={String(m.id)} value={String(m.id)}>{String(m.name)} ({String(m.id)})</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <F label="职务" v={form.position} onChange={v => setForm(f => ({ ...f, position: v }))} />
                <label className="block">
                  <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>届别</span>
                  <select className="admin-input" value={form.cohort} onChange={e => setForm(f => ({ ...f, cohort: e.target.value }))}>
                    <option value="">请选择</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="开始日期" v={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} />
                <F label="结束日期" v={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} />
              </div>
              <F label="备注" v={form.remark} onChange={v => setForm(f => ({ ...f, remark: v }))} />
            </div>
            <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
              <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>保存</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>取消</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />
    </div>
  );
}

function F({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  const isDatetime = label.includes('日期');
  const displayValue = isDatetime && v ? v.slice(0, 16) : v;
  return <label className="block"><span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>{label}</span>
    <input className="admin-input" type={isDatetime ? 'datetime-local' : 'text'} value={displayValue}
      onChange={e => onChange(isDatetime && e.target.value ? e.target.value + ':00' : e.target.value)} />
  </label>;
}

function Btn({ label, onClick, danger }: { label: string; onClick?: () => void; danger?: boolean }) {
  let bg = 'var(--admin-bg)', color = 'var(--admin-text-secondary)';
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  return <button onClick={onClick} className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80" style={{ background: bg, color }}>{label}</button>;
}
