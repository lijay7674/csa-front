import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { fetchHomeData } from '../api/public';
import type { CsaContent, PublicPageData } from '@csa/shared';

interface HomeData {
  news?: CsaContent[];
  notices?: CsaContent[];
  competitions?: Array<{ competitionName?: string; awardLevel?: string; memberNames?: string; advisor?: string; year?: number; summary?: string }>;
  members?: Array<{ name?: string; cohort?: string; displayTitle?: string; displayAchievement?: string }>;
  events?: Array<{ title?: string; eventType?: string; startTime?: string; location?: string; status?: string }>;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal h-full ${className}`}>{children}</div>;
}

function getTagLabel(category: string): string {
  const map: Record<string, string> = { news: '活动新闻', notice: '竞赛公告', tech: '技术资讯', recruitment: '招新' };
  return map[category] || category;
}

function getLevelColor(level: string | undefined): string {
  if (!level) return 'bg-yellow-50 text-yellow-700';
  if (level.includes('国家级') || level.includes('一等')) return 'bg-yellow-50 text-yellow-700';
  if (level.includes('省级') || level.includes('二等')) return 'bg-gray-100 text-gray-600';
  return 'bg-orange-50 text-orange-700';
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomeData()
      .then((raw: PublicPageData) => {
        setData(raw as unknown as HomeData);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-muted)' }}>加载中...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>数据加载失败</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error || '无法连接到服务器'}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          重新加载
        </button>
      </div>
    );
  }

  const { news = [], competitions = [], members = [], events = [] } = data;

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="relative z-10 text-center py-24 overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--accent-light) 1px, transparent 1px),
            radial-gradient(circle at 80% 40%, var(--accent-light) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <span className="absolute left-[5%] top-[20%] font-mono text-[6rem] opacity-[0.06] animate-[float_4s_ease-in-out_infinite]"
          style={{ color: 'var(--accent)' }}>&lt;code&gt;</span>
        <span className="absolute right-[5%] bottom-[15%] font-mono text-[6rem] opacity-[0.06]"
          style={{ color: 'var(--accent)' }}>{'{ CSA }'}</span>

        <div className="relative z-10">
          <span className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
            Computer Software Association
          </span>
          <h1 className="font-heading text-[3.5rem] font-extrabold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent)' }}>计算机</span>软件学会
          </h1>
          <p className="text-lg max-w-[500px] mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
            以代码书写青春，用技术连接未来——我们是校园里最酷的技术社团
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register/recruit" className="btn-primary animate-[pulseSoft_2s_ease-in-out_infinite]">🙌 加入我们</Link>
            <Link to="/news" className="btn-outline">📅 浏览活动</Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>关于我们</h2>
            <div className="w-16 h-1 mx-auto mb-10 rounded-sm" style={{ background: 'var(--accent)' }} />
            <p className="max-w-[700px] mx-auto text-center text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              CSA 计算机软件学会是一个以技术为核心的学生社团。我们汇聚热爱编程、算法、软件开发的同道中人，
              通过技术讲座、实战项目、算法集训和学科竞赛，帮助每一位成员在技术的海洋中找到自己的方向。
            </p>
            <p className="text-center mt-5">
              <Link to="/about" className="font-semibold" style={{ color: 'var(--accent)' }}>了解更多 &rarr;</Link>
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      {news.length > 0 && (
        <section className="py-20 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>最新新闻</h2>
            <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>了解学会最新动态</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.slice(0, 3).map((item, i) => (
                <RevealSection key={item.id || i}>
                  <Link to={`/news/${item.id}`} className="card-base overflow-hidden cursor-pointer h-full flex flex-col block">
                    <div className="h-44 flex items-center justify-center font-mono text-3xl opacity-50 flex-shrink-0"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {item.coverImage
                        ? <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                        : <span>&lt; news /&gt;</span>
                      }
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="card-tag mb-2">{getTagLabel(item.category)}</span>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{item.summary}</p>
                      <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{item.publishedAt?.slice(0, 10)}</span>
                      </div>
                    </div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== EVENTS ===== */}
      {events.length > 0 && (
        <section className="py-20 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>近期活动</h2>
            <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>精彩活动不容错过</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.slice(0, 3).map((item, i) => (
                <RevealSection key={i}>
                  <div className="card-base p-6 h-full flex flex-col">
                    <span className="card-tag mb-3 w-fit">{item.eventType || '活动'}</span>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <div className="text-xs space-y-1 mt-auto" style={{ color: 'var(--text-muted)' }}>
                      {item.startTime && <p>📅 {item.startTime.slice(0, 16).replace('T', ' ')}</p>}
                      {item.location && <p>📍 {item.location}</p>}
                      <span className="status-badge mt-2" style={{
                        background: item.status === 'ongoing' ? '#DCFCE7' : '#F1F5F9',
                        color: item.status === 'ongoing' ? '#166534' : '#475569',
                      }}>{item.status === 'ongoing' ? '进行中' : '即将开始'}</span>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== COMPETITIONS ===== */}
      {competitions.length > 0 && (
        <section className="py-20 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>竞赛成果精选</h2>
            <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>每一行代码，都是荣誉的基石</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {competitions.slice(0, 4).map((c, i) => (
                <RevealSection key={i}>
                  <div className="card-base p-6 text-center h-full flex flex-col justify-between">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${getLevelColor(c.awardLevel)}`}>
                      {c.awardLevel || '获奖'}
                    </span>
                    <div className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{c.competitionName}</div>
                    {c.memberNames && <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{c.memberNames}</div>}
                    {c.year && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.year}年</div>}
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MEMBERS ===== */}
      {members.length > 0 && (
        <section className="py-20 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>优秀成员</h2>
            <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>他们用代码定义优秀</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {members.slice(0, 5).map((m, i) => (
                <RevealSection key={i}>
                  <div className="card-base p-8 text-center cursor-pointer relative overflow-hidden group">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {m.name?.[0] || '?'}
                    </div>
                    <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{m.displayTitle || m.cohort}</div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-lg)]"
                      style={{ background: 'var(--accent)', color: 'white' }}>
                      <h4 className="font-bold mb-2">{m.name}</h4>
                      <p className="text-sm opacity-90 leading-relaxed">{m.displayAchievement || '暂无简介'}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== RECRUIT BANNER ===== */}
      <section className="py-20 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <div className="rounded-[var(--radius-xl)] p-14 text-center text-white relative overflow-hidden"
              style={{ background: 'var(--banner-gradient)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 60%)' }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">2026 招新进行中</h3>
                <p className="text-base opacity-90 mb-6">无论你是编程萌新还是技术大佬，CSA 都有你的位置——加入我们，一起 Coding the Future</p>
                <Link to="/register/recruit" className="inline-block bg-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ color: 'var(--accent-dark)' }}>
                  立即报名 &rarr;
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
}
