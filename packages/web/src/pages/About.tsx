import { useEffect, useState } from 'react';
import { fetchAbout } from '../api/public';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const [data, setData] = useState<{ title?: string; summary?: string; body?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbout()
      .then(d => { setData(d as typeof data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorView error={error} />;

  const d = data;

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>
          学会简介
        </h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>
          {d?.title || 'Computer Software Association'}
        </p>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {d?.body ? (
          <section className="prose-csa">
            {/* 用 dangerouslySetInnerHTML 渲染富文本，或直接作为段落 */}
            <div className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: d.body }} />
          </section>
        ) : (
          <EmptyHint message="学会简介内容正在编辑中，敬请期待" />
        )}
      </div>
    </div>
  );
}


function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)' }} />
    </div>
  );
}

function ErrorView({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>加载失败</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error || '请稍后重试'}</p>
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📝</div>
      <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );
}
