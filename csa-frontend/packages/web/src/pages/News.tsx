import { useState, useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { Article } from '@csa/shared';
import { NEWS_CATEGORIES } from '@csa/shared';
import { sanitizeHtml } from '../utils/sanitize';

const MOCK_ARTICLES: Article[] = [
  { id:1, tag:'tech', tagLabel:'技术讲座', title:'LLM 大模型应用开发实战分享会', excerpt:'带你从零上手 LangChain，了解 RAG 架构在知识管理中的应用。', date:'2026-05-15', source:'CSA 技术部', location:'图书馆报告厅', body:'<h3>活动回顾</h3><p>本次技术讲座由 CSA 技术部主办，吸引了全校 120+ 名同学参与。</p>' },
  { id:2, tag:'competition', tagLabel:'竞赛培训', title:'蓝桥杯算法集训正式启动', excerpt:'每周三晚 7 点，由竞赛部学长带队刷题，冲刺省赛一等奖。', date:'2026-05-10', source:'CSA 竞赛部', location:'实训楼 403', body:'<h3>集训说明</h3><p>蓝桥杯是教育部认可的 A 类竞赛，CSA 组织系统化集训。</p>' },
  { id:3, tag:'activity', tagLabel:'团建活动', title:'CSA 春季技术马拉松完美收官', excerpt:'48 小时极限开发，12 支队伍，6 个精彩项目。', date:'2026-04-28', source:'CSA 组织部', location:'创新创业中心', body:'<h3>活动概述</h3><p>春季技术马拉松是 CSA 的传统品牌活动，今年已是第五届。</p>' },
  { id:4, tag:'tech', tagLabel:'技术讲座', title:'React 全栈开发工作坊', excerpt:'从组件设计到服务端渲染，手把手带你构建完整的全栈应用。', date:'2026-05-22', source:'CSA 技术部', location:'实验楼 A201', body:'<p>聚焦 React 19 新特性，Server Components 实战。</p>' },
  { id:5, tag:'activity', tagLabel:'团建活动', title:'新生破冰：Code & Coffee 交流会', excerpt:'新老成员面对面交流，喝咖啡聊技术，找到你的学习伙伴。', date:'2026-05-08', source:'CSA 组织部', location:'咖啡厅 B1', body:'<p>月度轻量级技术交流活动。</p>' },
  { id:6, tag:'other', tagLabel:'其他', title:'CSA 换届选举结果公示', excerpt:'新一届理事会成员名单公布，感谢上一届成员的辛苦付出。', date:'2026-04-20', source:'CSA 理事会', location:'', body:'<p>经全体会员投票，新一届 CSA 理事会成员正式产生。</p>' },
];

const PAGE_SIZE = 4;

export default function News() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Article | null>(null);

  if (detail) return <NewsDetail article={detail} onBack={() => setDetail(null)} />;

  const filtered = filter === 'all' ? MOCK_ARTICLES : MOCK_ARTICLES.filter(a => a.tag === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>活动新闻</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>了解学会最新动态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="card-base p-6 md:sticky md:top-20 self-start">
          <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>分类筛选</h4>
          <div className="space-y-1">
            {NEWS_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setFilter(cat.key); setPage(1); }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filter === cat.key ? 'font-semibold' : ''
                }`}
                style={filter === cat.key
                  ? { background: 'var(--accent-light)', color: 'var(--accent-dark)' }
                  : { color: 'var(--text-secondary)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Article list */}
        <div className="space-y-5">
          {pageArticles.map(article => (
            <article
              key={article.id}
              className="card-base flex flex-col md:flex-row overflow-hidden cursor-pointer"
              onClick={() => setDetail(article)}
            >
              <div className="md:w-60 h-40 md:h-auto flex-shrink-0 flex items-center justify-center font-mono text-2xl opacity-50"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                &lt; {article.tagLabel} /&gt;
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="card-tag w-fit">{article.tagLabel}</span>
                <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--text-primary)' }}>{article.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{article.excerpt}</p>
                <div className="flex gap-3 text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  <span>📅 {article.date}</span>
                  {article.location && <span>📍 {article.location}</span>}
                </div>
              </div>
            </article>
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

/* ---- Detail view ---- */
function NewsDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  const ref = useScrollReveal();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <div ref={ref} className="reveal">
        <div className="text-center mb-8">
          <span className="card-tag mb-3">{article.tagLabel}</span>
          <h1 className="font-heading text-3xl font-extrabold leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h1>
          <div className="flex justify-center gap-5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>📅 {article.date}</span>
            <span>✍ {article.source}</span>
            {article.location && <span>📍 {article.location}</span>}
          </div>
        </div>

        <div className="w-full h-80 rounded-2xl flex items-center justify-center font-mono text-4xl opacity-40 mb-8"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          &lt; article cover /&gt;
        </div>

        <div className="text-lg leading-[1.9] space-y-4" style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }} />

        <div className="text-center mt-10">
          <button onClick={onBack} className="btn-outline">← 返回列表</button>
        </div>
      </div>
    </div>
  );
}
