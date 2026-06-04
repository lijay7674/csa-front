import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublicEvents, fetchPublicEvent } from '../api/public';

type EventItem = Record<string, unknown>;

export default function Events() {
  const { id } = useParams<{ id?: string }>();
  if (id) return <EventDetail id={Number(id)} />;
  return <EventList />;
}

function EventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    fetchPublicEvents({ page, size: 9, status: 'enrolling' })
      .then(res => { setEvents(res.records); setTotal(res.total); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>活动报名</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>选择你感兴趣的活动，立即报名参与</p>
      </section>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {loading && <div className="flex justify-center py-16"><Spinner /></div>}
        {error && <div className="text-center py-16 text-red-500">{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20"><p className="text-lg" style={{ color: 'var(--text-muted)' }}>暂无活动</p></div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(e => (
            <a key={String(e.id)} href={`/events/${e.id}`} className="card-base overflow-hidden cursor-pointer block no-underline">
              <div className="h-40 flex items-center justify-center text-4xl" style={{ background: 'var(--accent-light)' }}>
                📅
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{String(e.title)}</h3>
                <div className="text-xs space-y-1 mb-3" style={{ color: 'var(--text-muted)' }}>
                  {e.startTime ? <p>📅 {String(e.startTime).slice(0, 16).replace('T', ' ')}</p> : null}
                  {e.location ? <p>📍 {String(e.location)}</p> : null}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {String(e.description || '').slice(0, 80)}{String(e.description || '').length > 80 ? '...' : ''}
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

function EventDetail({ id }: { id: number }) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicEvent(id).then(setEvent).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;
  if (!event) return <div className="text-center py-32" style={{ color: 'var(--text-muted)' }}>活动不存在</div>;

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>{String(event.title)}</h1>
      <div className="flex flex-wrap gap-4 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {event.startTime ? <span>📅 {String(event.startTime).slice(0, 16).replace('T', ' ')}</span> : null}
        {event.endTime ? <span>→ {String(event.endTime).slice(0, 16).replace('T', ' ')}</span> : null}
        {event.location ? <span>📍 {String(event.location)}</span> : null}
        {event.contactPerson ? <span>👤 {String(event.contactPerson)}</span> : null}
      </div>
      <div className="text-lg leading-[1.9] mb-10" style={{ color: 'var(--text-secondary)' }}>
        {String(event.description || '暂无活动详情')}
      </div>
      <div className="text-center">
        <a href={`/register/activity?targetId=${event.id}&targetName=${encodeURIComponent(String(event.title))}`}
          className="btn-primary text-lg px-10 py-4">
          📝 立即报名
        </a>
      </div>
    </div>
  );
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
