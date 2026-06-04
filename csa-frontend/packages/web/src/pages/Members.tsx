import { useEffect, useState } from 'react';
import { fetchMembersList, fetchMemberCohorts } from '../api/public';
import { useScrollReveal } from '../hooks/useScrollReveal';

type Member = { name?: string; cohort?: string; displayTitle?: string; displayAchievement?: string; displaySummary?: string; avatarUrl?: string; techDirection?: string };

export default function Members() {
  const [cohorts, setCohorts] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [cohort, setCohort] = useState('全部');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetchMembersList({ cohort: cohort === '全部' ? undefined : cohort, page, size: 12 })
      .then(res => { setMembers(res.records as Member[]); setTotal(res.total); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [cohort, page]);
  useEffect(() => { fetchMemberCohorts().then(setCohorts).catch(() => {}); }, []);

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>优秀成员</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>他们用代码定义优秀</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Cohort filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button key="all" onClick={() => { setCohort('全部'); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              cohort === '全部' ? 'text-white' : ''
            }`}
            style={cohort === '全部' ? { background: 'var(--accent)' } : { color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
          >全部届</button>
          {cohorts.map(c => (
            <button key={c} onClick={() => { setCohort(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                cohort === c ? 'text-white' : ''
              }`}
              style={cohort === c ? { background: 'var(--accent)' } : { color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
            >{c}届</button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-16"><Spinner /></div>}
        {error && <div className="text-center py-16"><p className="text-red-500 mb-3">{error}</p><button onClick={fetchData} className="btn-primary text-sm">重试</button></div>}
        {!loading && !error && members.length === 0 && (
          <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无成员数据</p></div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {members.map((m, i) => (
            <MemberCard key={i} member={m} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PaginationBtn key={p} page={p} current={page} onClick={() => setPage(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member: m }: { member: Member }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="card-base p-6 text-center reveal cursor-pointer relative overflow-hidden group">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold overflow-hidden"
        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
        {m.avatarUrl ? <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" /> : (m.name?.[0] || '?')}
      </div>
      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{m.displayTitle || m.techDirection}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.cohort}届</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-lg)]"
        style={{ background: 'var(--accent)', color: 'white' }}>
        <h4 className="font-bold mb-2">{m.name}</h4>
        <p className="text-sm opacity-90 leading-relaxed">{m.displayAchievement || m.displaySummary || '暂无简介'}</p>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />;
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
