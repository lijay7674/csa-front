import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNewsList, fetchNewsDetail } from '../api/public';
import { sanitizeHtml } from '../utils/sanitize';
import type { CsaContent } from '@csa/shared';

type ViewMode = 'list' | 'detail';

export default function Tech() {
  const { id } = useParams<{ id?: string }>();
  const [view, setView] = useState<ViewMode>(id ? 'detail' : 'list');
  const [detailId, setDetailId] = useState<number | null>(id ? Number(id) : null);

  if (view === 'detail' && detailId) {
    return <DetailView id={detailId} onBack={() => { setView('list'); setDetailId(null); }} />;
  }

  return <ListView onDetail={id => { setDetailId(id); setView('detail'); }} />;
}

function ListView({ onDetail }: { onDetail: (id: number) => void }) {
  const [items, setItems] = useState<CsaContent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetchNewsList({ page, size: 10, category: 'tech' })
      .then(res => { setItems(res.records); setTotal(res.total); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [page]);

  const totalPages = Math.ceil(total / 10);

  return <PageShell title="技术资讯" subtitle="精选技术文章与学习资源" loading={loading} error={error} retry={fetchData} empty={items.length === 0}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(item => (
        <article key={item.id} onClick={() => onDetail(item.id)}
          className="card-base overflow-hidden cursor-pointer flex flex-col">
          <div className="h-44 flex items-center justify-center font-mono text-3xl opacity-50 flex-shrink-0"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            {item.coverImage ? <img src={item.coverImage} alt="" className="w-full h-full object-cover" /> : '&lt; tech /&gt;'}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="card-tag mb-2 w-fit">技术资讯</span>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{item.summary}</p>
            <div className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>{item.publishedAt?.slice(0, 10)}</div>
          </div>
        </article>
      ))}
    </div>
    {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
  </PageShell>;
}

function DetailView({ id, onBack }: { id: number; onBack: () => void }) {
  const [item, setItem] = useState<CsaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsDetail(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageShell title="" loading />;
  if (error || !item) return <div className="text-center py-32"><p className="text-red-500">{error || '不存在'}</p></div>;

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <span className="card-tag mb-3">技术资讯</span>
      <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>{item.title}</h1>
      <div className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{item.publishedAt?.slice(0, 10)}</div>
      {item.coverImage && <img src={item.coverImage} alt="" className="w-full h-80 object-cover rounded-2xl mb-8" />}
      <div className="text-lg leading-[1.9] space-y-4" style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.body) }} />
      <div className="text-center mt-10"><button onClick={onBack} className="btn-outline">← 返回列表</button></div>
    </div>
  );
}

/* ---- Shared components ---- */
function PageShell({ title, subtitle, loading, error, retry, empty, children }: {
  title: string; subtitle?: string; loading?: boolean; error?: string | null; retry?: () => void; empty?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      {title && (
        <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
          <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>{title}</h1>
          {subtitle && <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>{subtitle}</p>}
        </section>
      )}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {loading && <div className="flex justify-center py-16"><Spinner /></div>}
        {error && <div className="text-center py-16"><p className="text-red-500 mb-3">{error}</p>{retry && <button onClick={retry} className="btn-primary text-sm">重试</button>}</div>}
        {!loading && !error && empty && <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无内容</p></div>}
        {!loading && !error && !empty && children}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />;
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} className="w-10 h-10 rounded-md border text-sm transition-colors"
          style={page === p ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }
            : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>{p}</button>
      ))}
    </div>
  );
}
