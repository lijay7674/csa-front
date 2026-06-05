import { useEffect, useState } from 'react';
import { fetchQuestionBankList, getAttachmentDownloadUrl } from '../api/public';
import type { CsaQuestionBank } from '@csa/shared';

const YEARS = [0, 2026, 2025, 2024, 2023, 2022];
const CATEGORIES = ['全部', '编程', '算法', '数据结构', '数学', '其他'];

export default function QuestionBank() {
  const [items, setItems] = useState<CsaQuestionBank[]>([]);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState(0);
  const [category, setCategory] = useState('全部');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetchQuestionBankList({
      page, size: 12,
      year: year || undefined,
      category: category === '全部' ? undefined : category,
    })
      .then(res => { setItems(res.records); setTotal(res.total); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [year, category, page]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>历史题库</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>历年竞赛题库与培训资料</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Filters */}
          <aside className="space-y-6">
            <FilterGroup title="年份">
              {YEARS.map(y => (
                <FilterBtn key={y} label={y === 0 ? '全部' : `${y}年`} active={year === y} onClick={() => { setYear(y); setPage(1); }} />
              ))}
            </FilterGroup>
            <FilterGroup title="分类">
              {CATEGORIES.map(c => (
                <FilterBtn key={c} label={c} active={category === c} onClick={() => { setCategory(c); setPage(1); }} />
              ))}
            </FilterGroup>
          </aside>

          {/* List */}
          <div>
            {loading && <div className="flex justify-center py-16"><Spinner /></div>}
            {error && <div className="text-center py-16"><p className="text-red-500 mb-3">{error}</p><button onClick={fetchData} className="btn-primary text-sm">重试</button></div>}
            {!loading && !error && items.length === 0 && <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无题目</p></div>}

            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="card-base p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}>{item.year}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}>{item.category}</span>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                    {item.source && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>来源: {item.source}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    <a href="#" className="btn-outline text-sm py-2 px-4" onClick={e => e.preventDefault()}>
                      📥 下载资料
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-base p-4">
      <h4 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${active ? 'font-semibold' : ''}`}
      style={active ? { background: 'var(--accent-light)', color: 'var(--accent-dark)' } : { color: 'var(--text-secondary)' }}>
      {label}
    </button>
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
