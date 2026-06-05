import { useState, useEffect } from 'react';
import { userApi, roleApi } from '../api/admin';
import { DataTable, Toolbar } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { ConfirmDialog } from '../components/Modal';

type Row = Record<string, unknown>;
type Tab = 'users' | 'roles';

// ================================================================
// 主页面
// ================================================================
export default function UsersPage() {
  const [tab, setTab] = useState<Tab>('users');

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--admin-text)' }}>权限管理</h1>
      <div className="flex gap-1 mb-4 rounded-lg p-1 w-fit" style={{ background: 'var(--admin-bg)' }}>
        {([
          { key: 'users' as Tab, label: '用户管理' },
          { key: 'roles' as Tab, label: '角色管理' },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'text-white shadow-sm' : ''
            }`}
            style={tab === t.key ? { background: 'var(--admin-accent)' } : { color: 'var(--admin-text-secondary)' }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'users' ? <UserTab /> : <RoleTab />}
    </div>
  );
}

// ================================================================
// 用户管理 Tab
// ================================================================
function UserTab() {
  const [data, setData] = useState({ records: [] as Row[], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Row[]>([]);
  const [form, setForm] = useState({ username: '', password: '', realName: '', phone: '', roleIds: [] as number[] });
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });

  const fetch = () => {
    setLoading(true);
    userApi.list({ page, size: 10, keyword: keyword || undefined })
      .then(setData).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page]);
  useEffect(() => { roleApi.list().then(setRoles); }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ username: '', password: '', realName: '', phone: '', roleIds: [] });
    setShowModal(true);
  };

  const openEdit = (r: Row) => {
    setEditId(Number(r.id));
    const userRoles = Array.isArray(r.roles) ? (r.roles as Row[]).map(rr => Number(rr.id)) : [];
    setForm({ username: String(r.username || ''), password: '', realName: String(r.realName || ''), phone: String(r.phone || ''), roleIds: userRoles });
    setShowModal(true);
  };

  const save = async () => {
    const payload: Row = { realName: form.realName, phone: form.phone || null, roleIds: form.roleIds };
    if (!editId) {
      payload.username = form.username;
      payload.password = form.password;
      await userApi.create(payload);
    } else {
      if (form.password) payload.password = form.password;
      await userApi.update(editId, payload);
    }
    setShowModal(false);
    fetch();
  };

  const toggleRole = (roleId: number) => {
    setForm(f => ({
      ...f,
      roleIds: f.roleIds.includes(roleId)
        ? f.roleIds.filter(id => id !== roleId)
        : [...f.roleIds, roleId],
    }));
  };

  const columns: Column<Row>[] = [
    { key: 'id', title: 'ID', width: '50px' },
    { key: 'username', title: '用户名', render: r => <span className="font-medium">{String(r.username)}</span> },
    { key: 'realName', title: '姓名', render: r => String(r.realName || '-') },
    { key: 'phone', title: '手机号', render: r => String(r.phone || '-') },
    { key: 'roles', title: '角色', render: r => (
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(r.roles) ? (r.roles as Row[]).map(rr => (
            <span key={Number(rr.id)} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              {String(rr.roleName)}
            </span>
          )) : <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>无角色</span>}
        </div>
      ),
    },
    { key: 'status', title: '状态', render: r => Number(r.status) === 1
        ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#166534' }}>启用</span>
        : <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>禁用</span>
    },
    { key: 'actions', title: '操作', render: r => (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          <Btn label="编辑" onClick={() => openEdit(r)} />
          {Number(r.status) === 1
            ? <Btn label="禁用" danger onClick={() => setConfirmState({ open: true, message: `确定禁用 ${r.username}？`, onOk: () => { userApi.updateStatus(Number(r.id), 0).then(fetch); }, danger: true })} />
            : <Btn label="启用" success onClick={() => { userApi.updateStatus(Number(r.id), 1).then(fetch); } } />
          }
          {String(r.username) !== 'admin' && (
            <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: `确定删除用户 ${r.username}？此操作不可恢复。`, onOk: () => { userApi.delete(Number(r.id)).then(fetch); }, danger: true })} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增用户</button>
        <Btn label="刷新" onClick={fetch} />
      </div>
      <Toolbar searchPlaceholder="搜索用户名/姓名/手机号..." searchValue={keyword}
        onSearchChange={v => { setKeyword(v); setPage(1); }} />
      <DataTable columns={columns} data={data.records} loading={loading} error={error}
        total={data.total} page={page} pageSize={10} onPageChange={setPage} emptyText="暂无用户" keyField="id" />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>{editId ? '编辑用户' : '新增用户'}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl" style={{ color: 'var(--admin-text-secondary)' }}>×</button>
            </div>
            <div className="space-y-3">
              {!editId && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="用户名" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} />
                  <Field label="密码" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />
                </div>
              )}
              {editId && <Field label="新密码（留空不修改）" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />}
              <div className="grid grid-cols-2 gap-3">
                <Field label="真实姓名" value={form.realName} onChange={v => setForm(f => ({ ...f, realName: v }))} />
                <Field label="手机号" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
              </div>
              <div>
                <span className="text-xs font-semibold mb-2 block" style={{ color: 'var(--admin-text)' }}>角色</span>
                <div className="flex flex-wrap gap-2">
                  {roles.map(rr => (
                    <button key={Number(rr.id)} onClick={() => toggleRole(Number(rr.id))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.roleIds.includes(Number(rr.id)) ? 'text-white' : ''
                      }`}
                      style={form.roleIds.includes(Number(rr.id))
                        ? { background: 'var(--admin-accent)', borderColor: 'var(--admin-accent)' }
                        : { borderColor: 'var(--admin-border)', color: 'var(--admin-text-secondary)' }}>
                      {String(rr.roleName)}
                    </button>
                  ))}
                </div>
              </div>
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

// ================================================================
// 角色管理 Tab
// ================================================================
function RoleTab() {
  const [roles, setRoles] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ roleName: '', roleCode: '', permissions: '', description: '' });
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onOk: (() => void) | null; danger?: boolean }>({ open: false, message: '', onOk: null });

  const fetch = () => { setLoading(true); roleApi.list().then(setRoles).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditId(null); setForm({ roleName: '', roleCode: '', permissions: '[]', description: '' }); setShowModal(true); };
  const openEdit = (r: Row) => {
    setEditId(Number(r.id));
    setForm({ roleName: String(r.roleName || ''), roleCode: String(r.roleCode || ''), permissions: String(r.permissions || '[]'), description: String(r.description || '') });
    setShowModal(true);
  };

  const save = async () => {
    const payload: Row = { roleName: form.roleName, permissions: form.permissions, description: form.description };
    if (!editId) {
      await roleApi.create({ ...payload, roleCode: form.roleCode });
    } else {
      await roleApi.update(editId, payload);
    }
    setShowModal(false);
    fetch();
  };

  const columns: Column<Row>[] = [
    { key: 'id', title: 'ID', width: '50px' },
    { key: 'roleName', title: '角色名', render: r => <span className="font-medium">{String(r.roleName)}</span> },
    { key: 'roleCode', title: '编码', render: r => <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--admin-bg)', color: 'var(--admin-accent)' }}>{String(r.roleCode)}</code> },
    { key: 'description', title: '说明', render: r => String(r.description || '-') },
    { key: 'actions', title: '操作', render: r => (
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          <Btn label="编辑" onClick={() => openEdit(r)} />
          <Btn label="删除" danger onClick={() => setConfirmState({ open: true, message: `确定删除角色 ${r.roleName}？此操作不可恢复。`, onOk: () => { roleApi.delete(Number(r.id)).then(fetch); }, danger: true })} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--admin-accent)' }}>+ 新增角色</button>
        <Btn label="刷新" onClick={fetch} />
      </div>
      <DataTable columns={columns} data={roles} loading={loading} error={null}
        total={roles.length} page={1} pageSize={50} onPageChange={() => {}} emptyText="暂无角色" keyField="id" />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--admin-text)' }}>{editId ? '编辑角色' : '新增角色'}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl" style={{ color: 'var(--admin-text-secondary)' }}>×</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="角色名称" value={form.roleName} onChange={v => setForm(f => ({ ...f, roleName: v }))} />
                {!editId && <Field label="角色编码" value={form.roleCode} onChange={v => setForm(f => ({ ...f, roleCode: v }))} />}
              </div>
              <Field label="说明" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
              <label className="block">
                <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>权限列表（JSON数组）</span>
                <textarea className="admin-input min-h-[80px] font-mono text-xs" value={form.permissions}
                  onChange={e => setForm(f => ({ ...f, permissions: e.target.value }))}
                  placeholder={'["content:read","content:write","member:read"]'} />
              </label>
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

// ================================================================
// 通用组件
// ================================================================
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold mb-1 block" style={{ color: 'var(--admin-text)' }}>{label}</span>
      <input className="admin-input" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function Btn({ label, onClick, danger, success }: { label: string; onClick?: () => void; danger?: boolean; success?: boolean }) {
  let bg = 'var(--admin-bg)', color = 'var(--admin-text-secondary)';
  if (danger) { bg = '#FEE2E2'; color = '#991B1B'; }
  if (success) { bg = '#DCFCE7'; color = '#166534'; }
  return <button onClick={onClick} className="text-xs px-2 py-1 rounded font-medium transition-opacity hover:opacity-80" style={{ background: bg, color }}>{label}</button>;
}
