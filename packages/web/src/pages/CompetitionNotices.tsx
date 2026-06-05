import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNoticesList, fetchNoticeDetail } from '../api/public';
import { sanitizeHtml } from '../utils/sanitize';
import type { CsaContent } from '@csa/shared';

type ViewMode = 'list' | 'detail';

export default function CompetitionNotices() {
  const { id } = useParams<{ id?: string }>();
  const [view, setView] = useState<ViewMode>('list');
  const [detailId, setDetailId] = useState<number | null>(id ? Number(id) : null);

  useEffect(() => {
    if (detailId) setView('detail');
  }, [detailId]);

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
    fetchNoticesList({ page, size: 10 })
      .then(res => { setItems(res.records); setTotal(res.total); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>
          竞赛公告
        </h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>最新比赛通知与选拔公告</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {loading && <Spinner />}
        {error && <div className="text-center py-16"><p className="text-red-500 mb-3">{error}</p><button onClick={fetchData} className="btn-primary text-sm">重试</button></div>}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无公告</p></div>
        )}

        <div className="space-y-4">
          {items.map(item => (
            <article
              key={item.id}
              onClick={() => onDetail(item.id)}
              className="card-base p-6 cursor-pointer flex flex-col md:flex-row gap-5"
            >
              <div className="md:w-48 h-32 md:h-auto rounded-lg flex-shrink-0 flex items-center justify-center font-mono text-2xl opacity-50"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {item.coverImage ? <img src={item.coverImage} alt="" className="w-full h-full object-cover rounded-lg" /> : '📢'}
              </div>
              <div className="flex-1">
                <span className="card-tag mb-2">竞赛公告</span>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{item.summary}</p>
                <div className="flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>📅 {item.publishedAt?.slice(0, 10)}</span>
                  {item.source && <span>✍ {item.source}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PaginationBtn key={p} page={p} current={page} onClick={() => setPage(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailView({ id, onBack }: { id: number; onBack: () => void }) {
  const [item, setItem] = useState<CsaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNoticeDetail(id)
      .then(setItem)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;
  if (error || !item) return <div className="text-center py-32"><p className="text-red-500">{error || '公告不存在'}</p></div>;

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <span className="card-tag mb-3">竞赛公告</span>
        <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>{item.title}</h1>
        <div className="flex justify-center gap-5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>📅 {item.publishedAt?.slice(0, 10)}</span>
          {item.source && <span>✍ {item.source}</span>}
        </div>
      </div>

      {item.coverImage && <img src={item.coverImage} alt="" className="w-full h-80 object-cover rounded-2xl mb-8" />}

      <div className="text-lg leading-[1.9] space-y-4" style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.body) }} />

      <div className="text-center mt-10">
        <button onClick={onBack} className="btn-outline">← 返回列表</button>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} /></div>;
}

function PaginationBtn({ page, current, onClick }: { page: number; current: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-10 h-10 rounded-md border text-sm transition-colors"
      style={page === current ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }
        : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
      {page}
    </button>
  );
}
