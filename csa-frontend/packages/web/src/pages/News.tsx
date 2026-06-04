import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { fetchNewsList, fetchNewsDetail } from '../api/public';
import { CONTENT_CATEGORIES } from '@csa/shared';
import { sanitizeHtml } from '../utils/sanitize';
import type { CsaContent } from '@csa/shared';

const PAGE_SIZE = 6;

export default function News() {
  const { id } = useParams<{ id?: string }>();

  if (id) {
    return <NewsDetailPage id={Number(id)} />;
  }

  return <NewsListPage />;
}

/* ---- List View ---- */
function NewsListPage() {
  const [articles, setArticles] = useState<CsaContent[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetchNewsList({
      page,
      size: PAGE_SIZE,
      category: filter === 'all' ? undefined : filter,
    })
      .then(res => {
        setArticles(res.records);
        setTotal(res.total);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, [filter, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>活动新闻</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>了解学会最新动态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar filter */}
        <aside className="card-base p-6 md:sticky md:top-20 self-start">
          <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>分类筛选</h4>
          <div className="space-y-1">
            <FilterBtn label="全部" active={filter === 'all'} onClick={() => { setFilter('all'); setPage(1); }} />
            {CONTENT_CATEGORIES.map(cat => (
              <FilterBtn
                key={cat.key}
                label={cat.label}
                active={filter === cat.key}
                onClick={() => { setFilter(cat.key); setPage(1); }}
              />
            ))}
          </div>
        </aside>

        {/* Article list */}
        <div className="space-y-5">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-dashed rounded-full animate-spin"
                style={{ borderColor: 'var(--accent)' }} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-3">{error}</p>
              <button onClick={fetchData} className="btn-primary text-sm">重试</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无内容</p>
            </div>
          )}

          {/* Articles */}
          {!loading && articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-md border text-sm transition-colors ${
                    page === p ? 'text-white' : ''
                  }`}
                  style={page === p
                    ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                    : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }
                  }
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Detail View ---- */
function NewsDetailPage({ id }: { id: number }) {
  const [article, setArticle] = useState<CsaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useScrollReveal();

  useEffect(() => {
    fetchNewsDetail(id)
      .then(setArticle)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin"
          style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 mb-3">{error || '文章不存在'}</p>
        <a href="/news" className="btn-outline text-sm">← 返回列表</a>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <div ref={ref} className="reveal">
        <div className="text-center mb-8">
          <span className="card-tag mb-3">{getCategoryLabel(article.category)}</span>
          <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h1>
          <div className="flex justify-center gap-5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>📅 {article.publishedAt?.slice(0, 10) || article.createdAt?.slice(0, 10)}</span>
            {article.source && <span>✍ {article.source}</span>}
          </div>
        </div>

        {article.coverImage && (
          <img src={article.coverImage} alt={article.title}
            className="w-full h-80 object-cover rounded-2xl mb-8" />
        )}

        <div className="text-lg leading-[1.9] space-y-4" style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }} />

        <div className="text-center mt-10">
          <a href="/news" className="btn-outline">← 返回列表</a>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */
function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${active ? 'font-semibold' : ''}`}
      style={active
        ? { background: 'var(--accent-light)', color: 'var(--accent-dark)' }
        : { color: 'var(--text-secondary)' }
      }
    >{label}</button>
  );
}

function ArticleCard({ article }: { article: CsaContent }) {
  return (
    <a href={`/news/${article.id}`} className="card-base flex flex-col md:flex-row overflow-hidden cursor-pointer block">
      <div className="md:w-60 h-40 md:h-auto flex-shrink-0 flex items-center justify-center font-mono text-2xl opacity-50"
        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
        {article.coverImage
          ? <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
          : <span>&lt; {getCategoryLabel(article.category)} /&gt;</span>
        }
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="card-tag w-fit">{getCategoryLabel(article.category)}</span>
        <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--text-primary)' }}>{article.title}</h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{article.summary}</p>
        <div className="flex gap-3 text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          <span>📅 {article.publishedAt?.slice(0, 10) || article.createdAt?.slice(0, 10)}</span>
        </div>
      </div>
    </a>
  );
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = { news: '活动新闻', notice: '竞赛公告', tech: '技术资讯', recruitment: '招新' };
  return map[category] || category;
}
