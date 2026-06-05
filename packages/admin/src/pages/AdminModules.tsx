import { useState, useEffect } from 'react';
import { eventApi, competitionApi, questionBankApi, fetchOverview, publicApi, memberApi } from '../api/admin';
import { DataTable, Toolbar, StatusBadge } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { ConfirmDialog } from '../components/Modal';
import useAuth from '../hooks/useAuth';

type Row = Record<string, unknown>;

// ---- 通用 Hook ----
function useCrud(fetcher: (p: Record<string, unknown>) => Promise<{ records: Row[]; total: number }>, deps: unknown[] = []) {
  const [data, setData] = useState({ records: [] as Row[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = (params: Record<string, unknown> = {}) => {
    setLoading(true);
    fetcher(params).then(setData).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, deps);
  return { data, loading, error, reload };
}

// ---- 弹窗组件 ----
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>{title}</h3>
          <button onClick={onClose} className="text-xl" style={{ color: 'var(--admin-text-secondary)' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const isDatetime = label.includes('时间') || label.includes('日期');
  const displayValue = isDatetime && value ? value.slice(0, 16) : value;
  return <label className="block"><span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>{label}</span>
    <input className="admin-input" type={isDatetime ? 'datetime-local' : 'text'} value={displayValue}
      onChange={e => onChange(isDatetime && e.target.value ? e.target.value + ':00' : e.target.value)} />
  </label>;
}

function Btn({ label, onClick, primary, danger, success }: { label: string; onClick?: () => void; primary?: boolean; danger?: boolean; success?: boolean }) {
  let bg = 'var(--admin-bg)', color = 'var(--admin-text-secondary)';
  if (primary) { bg = 'var(--admin-accent)'; color = 'white'; }
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  if (success) { bg = '#DCFCE7'; color = '#166534'; }
  return <button onClick={onClick} className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80" style={{ background: bg, color }}>{label}</button>;
}

// ---- 通用届别列表 ----
const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));

// ---- 分页器 ----
function Paginator({ page, total, pageSize, onPageChange }: { page: number; total: number; pageSize: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}
        className="px-2 py-1 text-xs rounded" style={{ color: page <= 1 ? 'var(--admin-text-secondary)' : 'var(--admin-accent)', opacity: page <= 1 ? 0.4 : 1 }}>‹</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className="px-3 py-1 text-xs rounded font-medium"
          style={{ background: p === page ? 'var(--admin-accent)' : 'transparent', color: p === page ? 'white' : 'var(--admin-text-secondary)' }}>{p}</button>
      ))}
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
        className="px-2 py-1 text-xs rounded" style={{ color: page >= totalPages ? 'var(--admin-text-secondary)' : 'var(--admin-accent)', opacity: page >= totalPages ? 0.4 : 1 }}>›</button>
    </div>
  );
}

// ================================================================
// 活动管理
// ================================================================
export function EventList() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useCrud(p => eventApi.list({ page, size: 10, ...p }), [page]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', eventType: '', startTime: '', endTime: '', location: '', description: '', status: 'DRAFT' });
  const { hasPermission, isSuperAdmin } = useAuth();
  const canManage = hasPermission('event:write');
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openNew = () => { setEditId(null); setForm({ title: '', eventType: '', startTime: '', endTime: '', location: '', description: '', status: 'DRAFT' }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditId(Number(r.id)); setForm({ title: Str(r.title), eventType: Str(r.eventType), startTime: Str(r.startTime), endTime: Str(r.endTime), location: Str(r.location), description: Str(r.description), status: Str(r.status) }); setShowModal(true); };
  const save = async () => { if (editId) await eventApi.update(editId, form); else await eventApi.create(form); setShowModal(false); reload(); };

  const doAction = async (fn: () => Promise<unknown>, id: number) => {
    setActionLoading(id);
    setActionError(null);
    try { await fn(); } catch (e: unknown) { setActionError(e instanceof Error ? e.message : '操作失败'); }
    reload();
    setActionLoading(null);
  };

  const cols: Column<Row>[] = [
    { key: 'title', title: '活动名称', render: r => <span className="font-medium">{String(r.title)}</span> },
    { key: 'eventType', title: '类型' },
    { key: 'startTime', title: '开始时间', render: r => String(r.startTime || '').slice(0, 10) },
    { key: 'location', title: '地点' },
    { key: 'status', title: '状态', render: r => <StatusBadge status={String(r.status)} /> },
    { key: 'actions', title: '操作', render: r => {
        const s = String(r.status);
        const id = Number(r.id);
        return (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {canManage && <Btn label="编辑" onClick={() => openEdit(r)} />}
          {canManage && s === 'DRAFT' && <Btn label="发布" success onClick={() => doAction(() => eventApi.publish(id), id)} />}
          {canManage && s === 'PUBLISHED' && <Btn label="结束" danger onClick={() => setConfirmState({ open: true, message: '确定结束该活动？结束后不可恢复。', onOk: () => doAction(() => eventApi.finish(id), id), danger: true })} />}
          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该活动？此操作不可恢复。', onOk: () => doAction(() => eventApi.delete(id), id), danger: true })} />}
          {actionLoading === id && <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>处理中...</span>}
        </div>
      );
    }},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>活动管理</h1>
        {canManage && <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增活动</button>}
      </div>
      {actionError && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}
      <Toolbar searchPlaceholder="搜索活动..." searchValue="" onSearchChange={() => {}} actions={<Btn label="刷新" onClick={() => reload()} />} />
      <DataTable columns={cols} data={data.records} loading={loading} error={error} total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无活动" keyField="id" />
      {showModal && <CrudModal title={editId ? '编辑活动' : '新增活动'} fields={['title','eventType','startTime','endTime','location','description']} form={form} setForm={updater => setForm(prev => updater(prev) as typeof prev)} onSave={save} onClose={() => setShowModal(false)} />}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />
    </div>
  );
}

// ================================================================
// 竞赛管理（含获奖管理）
// ================================================================
export function CompetitionList() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useCrud(p => competitionApi.list({ page, size: 10, ...p }), [page]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', level: '', compType: '', year: '', organizer: '', status: 'enrolling' });
  const { hasPermission, isSuperAdmin } = useAuth();
  const canManage = hasPermission('competition:write');
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 获奖管理状态
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [awards, setAwards] = useState<Row[]>([]);
  const [awardCounts, setAwardCounts] = useState<Record<number, number>>({});
  const [awardsLoading, setAwardsLoading] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardEditId, setAwardEditId] = useState<number | null>(null);
  const [awardForm, setAwardForm] = useState({ awardLevel: '', memberNames: '', advisor: '', summary: '' });

  // 加载获奖计数
  useEffect(() => {
    if (data.records.length === 0) return;
    Promise.all(data.records.map(r =>
      competitionApi.awards.list(Number(r.id)).then(awards => ({ id: Number(r.id), count: awards.length })).catch(() => ({ id: Number(r.id), count: 0 }))
    )).then(results => {
      const counts: Record<number, number> = {};
      results.forEach(r => { counts[r.id] = r.count; });
      setAwardCounts(counts);
    });
  }, [data]);

  const openNew = () => { setEditId(null); setForm({ name: '', level: '', compType: '', year: '', organizer: '', status: 'enrolling' }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditId(Number(r.id)); setForm({ name: Str(r.name), level: Str(r.level), compType: Str(r.compType), year: Str(r.year), organizer: Str(r.organizer), status: Str(r.status) }); setShowModal(true); };
  const save = async () => { if (editId) await competitionApi.update(editId, form); else await competitionApi.create(form); setShowModal(false); reload(); };

  const doAction = async (fn: () => Promise<unknown>, id: number) => {
    setActionLoading(id);
    setActionError(null);
    try { await fn(); } catch (e: unknown) { setActionError(e instanceof Error ? e.message : '操作失败'); }
    reload();
    setActionLoading(null);
  };

  // 获奖操作
  const toggleAwards = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setAwards([]);
      return;
    }
    setExpandedId(id);
    setAwardsLoading(true);
    try {
      const list = await competitionApi.awards.list(id);
      setAwards(list);
      setAwardCounts(prev => ({ ...prev, [id]: list.length }));
    } catch (e: unknown) { setActionError(e instanceof Error ? e.message : '加载获奖失败'); }
    setAwardsLoading(false);
  };

  const openAwardNew = () => { setAwardEditId(null); setAwardForm({ awardLevel: '', memberNames: '', advisor: '', summary: '' }); setShowAwardModal(true); };
  const openAwardEdit = (a: Row) => { setAwardEditId(Number(a.id)); setAwardForm({ awardLevel: Str(a.awardLevel), memberNames: Str(a.memberNames), advisor: Str(a.advisor), summary: Str(a.summary) }); setShowAwardModal(true); };

  const saveAward = async () => {
    if (!expandedId) return;
    if (awardEditId) {
      await competitionApi.awards.update(expandedId, awardEditId, awardForm);
    } else {
      await competitionApi.awards.create(expandedId, awardForm);
    }
    setShowAwardModal(false);
    // 重新加载获奖列表
    const list = await competitionApi.awards.list(expandedId);
    setAwards(list);
    setAwardCounts(prev => ({ ...prev, [expandedId]: list.length }));
  };

  const deleteAward = async (awardId: number) => {
    if (!expandedId) return;
    await competitionApi.awards.delete(expandedId, awardId);
    const list = await competitionApi.awards.list(expandedId);
    setAwards(list);
    setAwardCounts(prev => ({ ...prev, [expandedId]: list.length }));
  };

  const cols: Column<Row>[] = [
    { key: 'name', title: '竞赛名称', render: r => <span className="font-medium">{String(r.name)}</span> },
    { key: 'level', title: '等级' },
    { key: 'compType', title: '类型' },
    { key: 'year', title: '年份' },
    { key: 'awards', title: '获奖', render: r => {
        const count = awardCounts[Number(r.id)] ?? 0;
        return count > 0
          ? <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--admin-accent)', color: 'white', minWidth: 24 }}>{count}</span>
          : <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>0</span>;
    }},
    { key: 'status', title: '状态', render: r => <StatusBadge status={String(r.status)} /> },
    { key: 'actions', title: '操作', render: r => {
        const s = String(r.status);
        const id = Number(r.id);
        return (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {canManage && <Btn label="编辑" onClick={() => openEdit(r)} />}
          {canManage && s === 'DRAFT' && <Btn label="发布" success onClick={() => doAction(() => competitionApi.publish(id), id)} />}
          {canManage && s === 'PUBLISHED' && <Btn label="结束" danger onClick={() => setConfirmState({ open: true, message: '确定结束该竞赛？', onOk: () => doAction(() => competitionApi.finish(id), id), danger: true })} />}
          {canManage && <Btn label="查看获奖" success onClick={() => toggleAwards(id)} />}
          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该竞赛？此操作不可恢复。', onOk: () => doAction(() => competitionApi.delete(id), id), danger: true })} />}
          {actionLoading === id && <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>处理中...</span>}
        </div>
      );
    }},
  ];

  const AWARD_LEVELS = ['国家级', '省级', '校级', '其他'];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>竞赛管理</h1>
        {canManage && <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增竞赛</button>}
      </div>
      {actionError && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}
      <Toolbar searchPlaceholder="搜索竞赛..." searchValue="" onSearchChange={() => {}} actions={<Btn label="刷新" onClick={() => reload()} />} />
      <DataTable columns={cols} data={data.records} loading={loading} error={error} total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无竞赛" keyField="id" />

      {/* 获奖展开区域 */}
      {expandedId !== null && (
        <div className="mt-4 p-4 rounded-xl border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>
              获奖记录（{String(data.records.find(r => Number(r.id) === expandedId)?.name || '')}）
            </h3>
            <div className="flex gap-2">
              {canManage && <Btn label="+ 新增获奖" primary onClick={openAwardNew} />}
              <Btn label="收起" onClick={() => { setExpandedId(null); setAwards([]); }} />
            </div>
          </div>
          {awardsLoading ? (
            <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</p>
          ) : awards.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>暂无获奖记录</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>奖项等级</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>成员姓名</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>指导老师</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>简介</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold" style={{ color: 'var(--admin-text-secondary)' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map(a => (
                    <tr key={String(a.id)} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td className="py-2 px-3" style={{ color: 'var(--admin-text)' }}>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>{Str(a.awardLevel)}</span>
                      </td>
                      <td className="py-2 px-3" style={{ color: 'var(--admin-text)' }}>{Str(a.memberNames)}</td>
                      <td className="py-2 px-3" style={{ color: 'var(--admin-text)' }}>{Str(a.advisor) || '-'}</td>
                      <td className="py-2 px-3" style={{ color: 'var(--admin-text-secondary)', maxWidth: 200 }}>{Str(a.summary) || '-'}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          {canManage && <Btn label="编辑" onClick={() => openAwardEdit(a)} />}
                          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该获奖记录？', onOk: () => deleteAward(Number(a.id)), danger: true })} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && <CrudModal title={editId ? '编辑竞赛' : '新增竞赛'} fields={['name','level','compType','year','organizer']} form={form} setForm={updater => setForm(prev => updater(prev) as typeof prev)} onSave={save} onClose={() => setShowModal(false)} />}

      {/* 获奖弹窗 */}
      {showAwardModal && (
        <Modal title={awardEditId ? '编辑获奖' : '新增获奖'} onClose={() => setShowAwardModal(false)}>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>奖项等级</span>
              <select className="admin-input" value={awardForm.awardLevel} onChange={e => setAwardForm(f => ({ ...f, awardLevel: e.target.value }))}>
                <option value="">请选择</option>
                {AWARD_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <Field label="成员姓名" value={awardForm.memberNames} onChange={v => setAwardForm(f => ({ ...f, memberNames: v }))} />
            <Field label="指导老师" value={awardForm.advisor} onChange={v => setAwardForm(f => ({ ...f, advisor: v }))} />
            <Field label="简介" value={awardForm.summary} onChange={v => setAwardForm(f => ({ ...f, summary: v }))} />
          </div>
          <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
            <button onClick={saveAward} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>保存</button>
            <button onClick={() => setShowAwardModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>取消</button>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />
    </div>
  );
}

// ================================================================
// 题库管理
// ================================================================
export function QuestionBankList() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useCrud(p => questionBankApi.list({ page, size: 10, ...p }), [page]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', year: '', category: '', source: '', description: '' });
  const { hasPermission, isSuperAdmin } = useAuth();
  const canManage = hasPermission('question-bank:write');
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const openNew = () => { setEditId(null); setForm({ title: '', year: '', category: '', source: '', description: '' }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditId(Number(r.id)); setForm({ title: Str(r.title), year: Str(r.year), category: Str(r.category), source: Str(r.source), description: Str(r.description) }); setShowModal(true); };
  const save = async () => { if (editId) await questionBankApi.update(editId, form); else await questionBankApi.create(form); setShowModal(false); reload(); };

  const cols: Column<Row>[] = [
    { key: 'title', title: '标题', render: r => <span className="font-medium">{String(r.title)}</span> },
    { key: 'year', title: '年份' },
    { key: 'category', title: '分类' },
    { key: 'source', title: '来源' },
    { key: 'actions', title: '操作', render: r => (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          {canManage && <Btn label="编辑" onClick={() => openEdit(r)} />}
          {canManage && <Btn label="附件" onClick={() => setInfoMsg('附件管理功能开发中。')} />}
          {canManage && <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: '确定删除该题目？此操作不可恢复。', onOk: () => { questionBankApi.delete(Number(r.id)).then(() => reload()); }, danger: true })} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>题库管理</h1>
        {canManage && <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增题目</button>}
      </div>
      <Toolbar searchPlaceholder="搜索题库..." searchValue="" onSearchChange={() => {}} actions={<Btn label="刷新" onClick={() => reload()} />} />
      {infoMsg && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
          <span>{infoMsg}</span>
          <button onClick={() => setInfoMsg(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}
      <DataTable columns={cols} data={data.records} loading={loading} error={error} total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无题目" keyField="id" />
      {showModal && <CrudModal title={editId ? '编辑题目' : '新增题目'} fields={['title','year','category','source','description']} form={form} setForm={updater => setForm(prev => updater(prev) as typeof prev)} onSave={save} onClose={() => setShowModal(false)} />}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} danger={confirmState.danger}
        onConfirm={() => { confirmState.onOk?.(); setConfirmState({ open: false, message: '', onOk: null }); }}
        onCancel={() => setConfirmState({ open: false, message: '', onOk: null })} />
    </div>
  );
}

// ================================================================
// 统计 & 权限（占位）
// ================================================================
export function StatisticsPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchOverview().then(setStats).finally(() => setLoading(false)); }, []);
  if (loading) return <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</p>;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--admin-text)' }}>统计查询</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="p-5 rounded-xl border" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--admin-text-secondary)' }}>{k}</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--admin-accent)' }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsersPage() { return <Placeholder title="权限管理" />; }

// ================================================================
// 竞赛成果展示管理
// ================================================================
export function DisplayResults() {
  const [page, setPage] = useState(1);
  const [year, setYear] = useState('');
  const [level, setLevel] = useState('');
  const [data, setData] = useState({ records: [] as Row[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compId, setCompId] = useState(0);
  const [competitions, setCompetitions] = useState<Row[]>([]);
  const [awardList, setAwardList] = useState<Row[]>([]);

  // 加载竞赛列表
  useEffect(() => { competitionApi.list({ size: 9999 }).then(res => setCompetitions(res.records || [])); }, []);

  // 竞赛切换时加载获奖
  useEffect(() => {
    if (compId) competitionApi.awards.list(compId).then(setAwardList);
    else setAwardList([]);
  }, [compId]);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, unknown> = { page, size: 10 };
    if (year) params.year = year;
    if (level) params.level = level;
    publicApi.getResults(params)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, year, level]);

  const toggleAwardDisplay = async (id: number, display: boolean) => {
    await competitionApi.awards.update(compId, id, { isPublicDisplay: display ? 1 : 0 });
    competitionApi.awards.list(compId).then(setAwardList);
    fetchData();
  };

  const LEVELS = ['国家级', '省级', '校级', '其他'];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>竞赛成果展示管理</h1>
        <button onClick={fetchData} className="text-xs px-3 py-1.5 rounded font-medium" style={{ color: 'var(--admin-accent)', background: 'var(--admin-bg)' }}>刷新</button>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-lg" style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)' }}>
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
          年份:
          <select className="admin-input text-xs py-1.5" style={{ width: 100 }} value={year} onChange={e => { setYear(e.target.value); setPage(1); }}>
            <option value="">全部</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
          等级:
          <select className="admin-input text-xs py-1.5" style={{ width: 110 }} value={level} onChange={e => { setLevel(e.target.value); setPage(1); }}>
            <option value="">全部</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      {/* 选择竞赛获奖展示 */}
      <div className="mb-5 p-4 rounded-lg" style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)' }}>
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--admin-text)' }}>选择竞赛获奖展示</h4>
        <div className="flex gap-2 mb-3">
          <select className="admin-input flex-1" value={compId} onChange={e => setCompId(Number(e.target.value))}>
            <option value={0}>请选择竞赛</option>
            {competitions.map(c => (
              <option key={Number(c.id)} value={Number(c.id)}>{String(c.name)} ({String(c.year)})</option>
            ))}
          </select>
        </div>
        {awardList.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-1">
            {awardList.map(a => (
              <div key={Number(a.id)} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/50">
                <span className="text-sm" style={{ color: 'var(--admin-text)' }}>{String(a.awardLevel)} - {String(a.memberNames || '')}</span>
                <button onClick={() => toggleAwardDisplay(Number(a.id), a.isPublicDisplay !== 1)}
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={a.isPublicDisplay === 1
                    ? { background: '#FEE2E2', color: '#991B1B' }
                    : { background: '#DCFCE7', color: '#166534' }}>
                  {a.isPublicDisplay === 1 ? '取消展示' : '添加展示'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <p className="text-sm py-12 text-center" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</p>
      ) : data.records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>暂无获奖记录</p>
        </div>
      ) : (
        <>
          {/* 获奖卡片列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.records.map(r => (
              <div key={String(r.id)} className="p-4 rounded-xl border transition-shadow hover:shadow-md" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>{Str(r.competitionName)}</h3>
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>{Str(r.awardLevel)}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <span style={{ color: 'var(--admin-text-secondary)' }}>获奖成员:</span>
                    <span style={{ color: 'var(--admin-text)' }}>{Str(r.memberNames) || '-'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{ color: 'var(--admin-text-secondary)' }}>指导老师:</span>
                    <span style={{ color: 'var(--admin-text)' }}>{Str(r.advisor) || '-'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{ color: 'var(--admin-text-secondary)' }}>年份:</span>
                    <span style={{ color: 'var(--admin-text)' }}>{Str(r.competitionYear)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页器 */}
          <Paginator page={page} total={data.total} pageSize={10} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

// ================================================================
// 优秀成员展示管理
// ================================================================
export function DisplayMembers() {
  const [page, setPage] = useState(1);
  const [cohort, setCohort] = useState('');
  const [cohorts, setCohorts] = useState<string[]>([]);
  const [cohortsLoading, setCohortsLoading] = useState(true);
  const [data, setData] = useState({ records: [] as Row[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<Row[]>([]);
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ displayTitle: '', displayAchievement: '', displaySummary: '' });
  const [showEditModal, setShowEditModal] = useState(false);

  // 加载届别列表
  useEffect(() => {
    publicApi.getMemberCohorts()
      .then(setCohorts)
      .catch(() => setCohorts([]))
      .finally(() => setCohortsLoading(false));
  }, []);

  // 加载成员数据
  const fetchData = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, unknown> = { page, size: 12 };
    if (cohort) params.cohort = cohort;
    publicApi.getMembers(params)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, cohort]);

  const searchMembers = () => {
    memberApi.list({ keyword: searchName, size: 20 })
      .then(res => setSearchResults(res.records));
  };

  const toggleMemberDisplay = async (id: number, display: boolean) => {
    await memberApi.update(id, { isPublicDisplay: display ? 1 : 0 });
    searchMembers();
    fetchData();
  };

  /** 生成首字母头像颜色 */
  const avatarColor = (name: string): string => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  /** 截断文本 */
  const truncate = (text: string, max: number): string => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>优秀成员展示管理</h1>
        <button onClick={fetchData} className="text-xs px-3 py-1.5 rounded font-medium" style={{ color: 'var(--admin-accent)', background: 'var(--admin-bg)' }}>刷新</button>
      </div>

      {/* 添加展示成员 */}
      <div className="mb-5 p-4 rounded-lg" style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)' }}>
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--admin-text)' }}>添加展示成员</h4>
        <div className="flex gap-2">
          <input className="admin-input flex-1" placeholder="搜索成员姓名..." value={searchName}
            onChange={e => setSearchName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') searchMembers(); }} />
          <button onClick={searchMembers} className="px-3 py-1.5 rounded text-xs font-semibold text-white"
            style={{ background: 'var(--admin-accent)' }}>搜索</button>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-3 max-h-60 overflow-y-auto space-y-1">
            {searchResults.map(m => (
              <div key={Number(m.id)} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/50">
                <span className="text-sm" style={{ color: 'var(--admin-text)' }}>{String(m.name)} ({String(m.cohort)}届)</span>
                <button onClick={() => toggleMemberDisplay(Number(m.id), m.isPublicDisplay !== 1)}
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={m.isPublicDisplay === 1
                    ? { background: '#FEE2E2', color: '#991B1B' }
                    : { background: '#DCFCE7', color: '#166534' }}>
                  {m.isPublicDisplay === 1 ? '取消展示' : '添加展示'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 届别选择器 */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-lg" style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)' }}>
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
          届别:
          <select className="admin-input text-xs py-1.5" style={{ width: 120 }} value={cohort} onChange={e => { setCohort(e.target.value); setPage(1); }}>
            <option value="">全部届别</option>
            {cohortsLoading
              ? <option disabled>加载中...</option>
              : cohorts.map(c => <option key={c} value={c}>{c}</option>)
            }
          </select>
        </label>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-lg leading-none ml-3">&times;</button>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <p className="text-sm py-12 text-center" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</p>
      ) : data.records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>暂无优秀成员</p>
        </div>
      ) : (
        <>
          {/* 成员卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.records.map(m => {
              const name = Str(m.name);
              const avatarUrl = Str(m.avatarUrl);
              return (
                <div key={String(m.id)} className="p-4 rounded-xl border transition-shadow hover:shadow-md text-center" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
                  {/* 头像 */}
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold text-white" style={{ background: avatarColor(name) }}>
                      {name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--admin-text)' }}>{name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded text-xs mb-2" style={{ background: '#F3F4F6', color: 'var(--admin-text-secondary)' }}>
                    {Str(m.cohort)}届
                  </span>
                  {Str(m.displayTitle) && (
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--admin-accent)' }}>{Str(m.displayTitle)}</p>
                  )}
                  {Str(m.displaySummary) && (
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--admin-text-secondary)' }}>
                      {truncate(Str(m.displaySummary), 60)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 分页器 */}
          <Paginator page={page} total={data.total} pageSize={12} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

// ================================================================
// 通用弹窗表单
// ================================================================
// 字段名 → 中文标签
const FIELD_LABELS: Record<string, string> = {
  title: '标题', eventType: '活动类型', startTime: '开始时间', endTime: '结束时间',
  location: '地点', description: '描述', status: '状态',
  name: '名称', level: '等级', compType: '竞赛类型', year: '年份', organizer: '主办方',
  category: '分类', source: '来源',
};

function CrudModal({ title, fields, form, setForm, onSave, onClose }: {
  title: string; fields: string[]; form: Record<string, string>;
  setForm: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  onSave: () => void; onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">
        {fields.map(f => (
          <Field key={f} label={FIELD_LABELS[f] || f} value={form[f] || ''} onChange={v => setForm(prev => ({ ...prev, [f]: v }))} />
        ))}
      </div>
      <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
        <button onClick={onSave} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>保存</button>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>取消</button>
      </div>
    </Modal>
  );
}

function Placeholder({ title }: { title: string }) {
  return <div className="flex flex-col items-center justify-center py-24"><div className="text-5xl mb-4">🚧</div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--admin-text)' }}>{title}</h2><p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>模块开发中...</p></div>;
}

function Str(v: unknown): string { return String(v || ''); }
