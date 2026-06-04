import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AwardItem {
  id: number;
  awardLevel: string;
  memberNames: string;
  advisor: string;
  summary: string;
  competitionName: string;
  competitionYear: number;
  competitionLevel: string;
}

export default function CompetitionResults() {
  const [data, setData] = useState<AwardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [year, setYear] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), size: '12' });
    if (year) params.set('year', year);
    if (level) params.set('level', level);
    fetch(`http://localhost:8080/api/public/results?${params}`)
      .then(r => r.json())
      .then(json => {
        if (json.code === 0 || json.code === 200) {
          setData(json.data.records || []);
          setTotal(json.data.total || 0);
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, year, level]);

  const totalPages = Math.ceil(total / 12);
  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));
  const levels = ['国家级', '省级', '校级', '其他'];

  const levelBadge = (lvl: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      '国家级': { bg: '#FEF3C7', color: '#92400E' },
      '省级': { bg: '#DBEAFE', color: '#1E40AF' },
      '校级': { bg: '#DCFCE7', color: '#166534' },
      '其他': { bg: '#F1F5F9', color: '#475569' },
    };
    const s = map[lvl] || { bg: '#F1F5F9', color: '#475569' };
    return { background: s.bg, color: s.color };
  };

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>竞赛成果</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>展示学会历年的竞赛成绩与荣誉</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* 筛选栏 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <select className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            value={year} onChange={e => { setYear(e.target.value); setPage(1); }}>
            <option value="">全部年份</option>
            {years.map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            value={level} onChange={e => { setLevel(e.target.value); setPage(1); }}>
            <option value="">全部等级</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {loading && <div className="flex justify-center py-16"><Spinner /></div>}
        {error && <div className="text-center py-16"><p className="text-red-500 mb-3">{error}</p><button onClick={fetchData} className="btn-primary text-sm">重试</button></div>}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无竞赛成果数据</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((item) => (
            <ResultCard key={item.id} item={item} levelBadge={levelBadge} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="w-10 h-10 rounded-md border text-sm transition-colors"
                style={page === p ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }
                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ item, levelBadge }: { item: AwardItem; levelBadge: (lvl: string) => { background: string; color: string } }) {
  const ref = useScrollReveal();
  const badge = levelBadge(item.awardLevel);
  return (
    <div ref={ref} className="card-base p-6 reveal group hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={badge}>{item.awardLevel}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
          {item.competitionYear || '-'}
        </span>
      </div>
      <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{item.competitionName}</h3>
      <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
        <span>👤 {parseMemberNames(item.memberNames) || '未知'}</span>
        {item.advisor && <span>· 🎓 {item.advisor}</span>}
      </div>
      {item.summary && (
        <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.summary}</p>
      )}
    </div>
  );
}

/** 解析 JSON 数组格式的成员名，如 ["张三","李四"] → "张三、李四" */
function parseMemberNames(raw: string | undefined): string {
  if (!raw) return '';
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.join('、');
  } catch { /* not JSON */ }
  return raw;
}

function Spinner() {
  return <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />;
}
