import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const NEWS = [
  { tag: '技术讲座', title: 'LLM 大模型应用开发实战分享会', excerpt: '带你从零上手 LangChain，了解 RAG 架构在知识管理中的应用。', date: '2026-05-15', loc: '图书馆报告厅' },
  { tag: '竞赛培训', title: '蓝桥杯算法集训正式启动', excerpt: '每周三晚 7 点，由竞赛部学长带队刷题，冲刺省赛一等奖。', date: '2026-05-10', loc: '实训楼 403' },
  { tag: '团建活动', title: 'CSA 春季技术马拉松完美收官', excerpt: '48 小时极限开发，12 支队伍，6 个精彩项目。', date: '2026-04-28', loc: '创新创业中心' },
];

const COMPETITIONS = [
  { badge: '国家级一等奖', level: 'gold', name: '蓝桥杯全国软件和信息技术专业人才大赛', meta: '2025 / Python 程序设计组' },
  { badge: '省级一等奖', level: 'silver', name: 'ACM-ICPC 国际大学生程序设计竞赛', meta: '2025 / 亚洲区域赛' },
  { badge: '国家级二等奖', level: 'gold', name: '中国大学生计算机设计大赛', meta: '2025 / 软件应用与开发类' },
  { badge: '省级二等奖', level: 'bronze', name: '全国大学生数学建模竞赛', meta: '2024 / Python 组' },
];

const MEMBERS = [
  { initial: 'L', name: '李明', role: '后端开发', detail: '2023届 / 计算机科学\nSpring Boot · Go · Redis\n蓝桥杯国一' },
  { initial: 'W', name: '王思雨', role: '前端开发', detail: '2024届 / 软件工程\nReact · TypeScript · Figma\n网页设计大赛金奖' },
  { initial: 'Z', name: '张浩', role: '算法竞赛', detail: '2023届 / 人工智能\nC++ · Python · 数学建模\nICPC 亚洲区域赛银牌' },
  { initial: 'C', name: '陈晓雯', role: 'UI 设计', detail: '2024届 / 数字媒体\nUI/UX · 品牌设计\n产品经理专栏作者' },
  { initial: 'L2', name: '刘洋', role: '全栈开发', detail: '2023届 / 软件工程\nVue · Node.js · Docker\n校优秀开源项目贡献者' },
];

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal h-full ${className}`}>{children}</div>;
}

export default function Home() {
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
        {/* Decorative code */}
        <span className="absolute left-[5%] top-[20%] font-mono text-[6rem] opacity-[0.06] animate-[float_4s_ease-in-out_infinite]" style={{ color: 'var(--accent)' }}>
          &lt;code&gt;
        </span>
        <span className="absolute right-[5%] bottom-[15%] font-mono text-[6rem] opacity-[0.06]" style={{ color: 'var(--accent)' }}>
          {'{ CSA }'}
        </span>

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
            <Link to="/register" className="btn-primary animate-[pulseSoft_2s_ease-in-out_infinite]">🙌 加入我们</Link>
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

      {/* ===== NEWS ===== */}
      <section className="py-20 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>最新新闻</h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>了解学会最新动态</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS.map((item, i) => (
              <RevealSection key={i}>
                <article className="card-base overflow-hidden cursor-pointer h-full flex flex-col">
                  <div className="h-44 flex items-center justify-center font-mono text-3xl opacity-50 flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    &lt; news /&gt;
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="card-tag mb-2">{item.tag}</span>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{item.excerpt}</p>
                    <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{item.date}</span><span>{item.loc}</span>
                    </div>
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPETITION ===== */}
      <section className="py-20 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>竞赛成果精选</h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>每一行代码，都是荣誉的基石</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPETITIONS.map((c, i) => (
              <RevealSection key={i}>
                <div className="card-base p-6 text-center cursor-pointer h-full flex flex-col justify-between">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${
                    c.level === 'gold' ? 'bg-yellow-50 text-yellow-700' :
                    c.level === 'silver' ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-50 text-orange-700'
                  }`}>{c.badge}</span>
                  <div className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.meta}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MEMBERS ===== */}
      <section className="py-20 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>优秀成员</h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>他们用代码定义优秀</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {MEMBERS.map((m, i) => (
              <RevealSection key={i}>
                <div className="card-base p-8 text-center cursor-pointer relative overflow-hidden group">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{m.initial}</div>
                  <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{m.role}</div>
                  {/* Hover detail overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-lg)]"
                    style={{ background: 'var(--accent)', color: 'white' }}>
                    <h4 className="font-bold mb-2">{m.name}</h4>
                    <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">{m.detail}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECRUIT BANNER ===== */}
      <section className="py-20 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <div className="rounded-[var(--radius-xl)] p-14 text-center text-white relative overflow-hidden" style={{ background: 'var(--banner-gradient)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 60%)' }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">2026 招新进行中</h3>
                <p className="text-base opacity-90 mb-6">无论你是编程萌新还是技术大佬，CSA 都有你的位置——加入我们，一起 Coding the Future</p>
                <Link to="/register" className="inline-block bg-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" style={{ color: 'var(--accent-dark)' }}>
                  立即报名 &rarr;
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== TECH ===== */}
      <section className="py-20 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>技术资讯推荐</h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>精选技术文章与资源</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: 'AI · LLM', title: 'RAG 技术在企业知识管理中的落地实践', excerpt: '详解混合检索（BM25+Vector）与 Reranker 在实际项目中的应用。', date: '2026-05-20' },
              { tag: '前端 · React', title: 'React 19 新特性一览：Server Components 实战', excerpt: '带你体验 React Server Components 带来的性能革命。', date: '2026-05-12' },
              { tag: '算法 · 竞赛', title: '动态规划终极总结：从入门到 ICPC 银牌', excerpt: '详细拆解 DP 的四大类型，附带竞赛级练习题。', date: '2026-04-30' },
            ].map((item, i) => (
              <RevealSection key={i}>
                <article className="card-base overflow-hidden h-full flex flex-col">
                  <div className="h-44 flex items-center justify-center font-mono text-3xl opacity-50 flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    &lt; tech /&gt;
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="card-tag mb-2">{item.tag}</span>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{item.excerpt}</p>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.date}</div>
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
