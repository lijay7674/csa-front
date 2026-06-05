import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contentApi } from '../api/admin';

const CATEGORIES = [
  { value: 'news', label: '活动新闻' },
  { value: 'notice', label: '竞赛公告' },
  { value: 'tech', label: '技术资讯' },
  { value: 'recruitment', label: '招新内容' },
  { value: 'about', label: '学会简介' },
];

interface ContentFormData {
  title: string;
  category: string;
  summary: string;
  body: string;
  coverImage: string;
  source: string;
  status: string;
}

const empty: ContentFormData = { title: '', category: 'news', summary: '', body: '', coverImage: '', source: '', status: 'DRAFT' };

export default function ContentForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<ContentFormData>(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      contentApi.get(Number(id))
        .then(data => setForm(data as unknown as ContentFormData))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (k: keyof ContentFormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (status?: string) => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, ...(status ? { status } : {}) };
      if (isEdit) {
        await contentApi.update(Number(id), payload);
      } else {
        await contentApi.create(payload);
      }
      navigate('/content', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16" style={{ color: 'var(--admin-text-secondary)' }}>加载中...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>← 返回</button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--admin-text)' }}>{isEdit ? '编辑内容' : '新建内容'}</h1>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg text-sm text-red-600" style={{ background: '#FEE2E2' }}>{error}</div>}

      <div className="space-y-4" style={{ background: 'var(--admin-card)', padding: 24, borderRadius: 12, border: '1px solid var(--admin-border)' }}>
        <FormRow label="标题" required>
          <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="请输入标题" />
        </FormRow>

        <div className="grid grid-cols-2 gap-4">
          <FormRow label="分类" required>
            <select className="admin-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </FormRow>
          <FormRow label="来源">
            <input className="admin-input" value={form.source} onChange={e => set('source', e.target.value)} placeholder="如：CSA技术部" />
          </FormRow>
        </div>

        <FormRow label="摘要">
          <textarea className="admin-input min-h-[60px]" value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="简要描述（列表页显示）" />
        </FormRow>

        <FormRow label="封面图 URL">
          <input className="admin-input" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
        </FormRow>

        <FormRow label="正文" required>
          <textarea className="admin-input min-h-[300px] font-mono text-sm" value={form.body} onChange={e => set('body', e.target.value)} placeholder="支持 HTML 标签..." />
        </FormRow>

        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <button onClick={() => handleSave('DRAFT')} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: 'var(--admin-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)' }}>
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button onClick={() => handleSave('PENDING_REVIEW')} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--admin-accent)' }}>
            {saving ? '提交中...' : '提交审核'}
          </button>
          <button onClick={() => navigate('/content')}
            className="px-5 py-2 rounded-lg text-sm"
            style={{ color: 'var(--admin-text-secondary)' }}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--admin-text)' }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
