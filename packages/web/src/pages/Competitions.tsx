import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublicCompetitions, fetchPublicCompetition } from '../api/public';

type CompItem = Record<string, unknown>;

export default function Competitions() {
  const { id } = useParams<{ id?: string }>();
  if (id) return <CompDetail id={Number(id)} />;
  return <CompList />;
}

function CompList() {
  const [comps, setComps] = useState<CompItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    fetchPublicCompetitions({ page, size: 9, status: 'enrolling' })
      .then(res => { setComps(res.records); setTotal(res.total); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>竞赛报名</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>选择你感兴趣的竞赛，组队或个人报名参赛</p>
      </section>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {loading && <div className="flex justify-center py-16"><Spinner /></div>}
        {error && <div className="text-center py-16 text-red-500">{error}</div>}
        {!loading && !error && comps.length === 0 && (
          <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无竞赛</p></div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {comps.map(c => (
            <a key={String(c.id)} href={`/competitions/${c.id}`} className="card-base overflow-hidden cursor-pointer block no-underline">
              <div className="h-40 flex items-center justify-center text-4xl" style={{ background: 'var(--accent-light)' }}>
                🏆
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                    {String(c.level)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    {String(c.compType)}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{String(c.name)}</h3>
                <div className="text-xs space-y-1 mb-3" style={{ color: 'var(--text-muted)' }}>
                  {c.regDeadline ? <p>⏰ 报名截止: {String(c.regDeadline).slice(0, 10)}</p> : null}
                  {c.organizer ? <p>🏛 {String(c.organizer)}</p> : null}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {String(c.description || '').slice(0, 80)}{String(c.description || '').length > 80 ? '...' : ''}
                </p>
              </div>
            </a>
          ))}
        </div>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}

function CompDetail({ id }: { id: number }) {
  const [comp, setComp] = useState<CompItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicCompetition(id).then(setComp).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;
  if (!comp) return <div className="text-center py-32" style={{ color: 'var(--text-muted)' }}>竞赛不存在</div>;

  const awards = Array.isArray(comp.awards) ? comp.awards as Record<string, unknown>[] : [];

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>{String(comp.name)}</h1>
      <div className="flex flex-wrap gap-4 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        <span>🏆 {String(comp.level)}</span>
        <span>📂 {String(comp.compType)}</span>
        <span>📅 {String(comp.year)}年</span>
        {comp.organizer ? <span>🏛 {String(comp.organizer)}</span> : null}
        {comp.regDeadline ? <span>⏰ 截止: {String(comp.regDeadline).slice(0, 10)}</span> : null}
      </div>
      <div className="text-lg leading-[1.9] mb-10" style={{ color: 'var(--text-secondary)' }}>
        {String(comp.description || '暂无竞赛详情')}
      </div>

      {awards.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🏅 历届获奖</h3>
          <div className="space-y-3">
            {awards.map((a, i) => (
              <div key={i} className="card-base p-4 flex items-center gap-4">
                <span className="text-2xl">{getMedal(String(a.awardLevel))}</span>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{String(a.awardLevel)}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{String(a.memberNames)}</p>
                </div>
                {a.advisor ? <span className="text-xs" style={{ color: 'var(--text-muted)' }}>导师: {String(a.advisor)}</span> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <a href={`/register/competition?targetId=${comp.id}&targetName=${encodeURIComponent(String(comp.name))}`}
          className="btn-primary text-lg px-10 py-4">
          📝 立即报名
        </a>
      </div>
    </div>
  );
}

function getMedal(level: string): string {
  if (level.includes('一等') || level.includes('金奖')) return '🥇';
  if (level.includes('二等') || level.includes('银奖')) return '🥈';
  if (level.includes('三等') || level.includes('铜奖')) return '🥉';
  return '🏅';
}

function Spinner() {
  return <div className="w-8 h-8 border-3 rounded-full animate-spin"
    style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />;
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
