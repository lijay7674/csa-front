/**
 * 新闻/资讯 API 服务
 * 后端未就绪时使用 mock 数据，设置 VITE_USE_MOCK=true 切换
 */

import type { Article } from '@csa/shared';
import { api } from './client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // 默认 mock

// ---- Mock 数据 ----
const MOCK_ARTICLES: Article[] = [
  { id:1, tag:'tech', tagLabel:'技术讲座', title:'LLM 大模型应用开发实战分享会', excerpt:'带你从零上手 LangChain，了解 RAG 架构在知识管理中的应用。', date:'2026-05-15', source:'CSA 技术部', location:'图书馆报告厅', body:'<h3>活动回顾</h3><p>本次技术讲座由 CSA 技术部主办，吸引了全校 120+ 名同学参与。</p>' },
  { id:2, tag:'competition', tagLabel:'竞赛培训', title:'蓝桥杯算法集训正式启动', excerpt:'每周三晚 7 点，由竞赛部学长带队刷题，冲刺省赛一等奖。', date:'2026-05-10', source:'CSA 竞赛部', location:'实训楼 403', body:'<h3>集训说明</h3><p>蓝桥杯是教育部认可的 A 类竞赛，CSA 组织系统化集训。</p>' },
  { id:3, tag:'activity', tagLabel:'团建活动', title:'CSA 春季技术马拉松完美收官', excerpt:'48 小时极限开发，12 支队伍，6 个精彩项目。', date:'2026-04-28', source:'CSA 组织部', location:'创新创业中心', body:'<h3>活动概述</h3><p>春季技术马拉松是 CSA 的传统品牌活动，今年已是第五届。</p>' },
  { id:4, tag:'tech', tagLabel:'技术讲座', title:'React 全栈开发工作坊', excerpt:'从组件设计到服务端渲染，手把手带你构建完整的全栈应用。', date:'2026-05-22', source:'CSA 技术部', location:'实验楼 A201', body:'<p>聚焦 React 19 新特性，Server Components 实战。</p>' },
  { id:5, tag:'activity', tagLabel:'团建活动', title:'新生破冰：Code & Coffee 交流会', excerpt:'新老成员面对面交流，喝咖啡聊技术，找到你的学习伙伴。', date:'2026-05-08', source:'CSA 组织部', location:'咖啡厅 B1', body:'<p>月度轻量级技术交流活动。</p>' },
  { id:6, tag:'other', tagLabel:'其他', title:'CSA 换届选举结果公示', excerpt:'新一届理事会成员名单公布，感谢上一届成员的辛苦付出。', date:'2026-04-20', source:'CSA 理事会', location:'', body:'<p>经全体会员投票，新一届 CSA 理事会成员正式产生。</p>' },
];

// ---- 模拟延迟 ----
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ---- API ----
export async function fetchArticles(params?: {
  tag?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ list: Article[]; total: number }> {
  if (USE_MOCK) {
    await delay();
    let list = MOCK_ARTICLES;
    if (params?.tag && params.tag !== 'all') {
      list = list.filter(a => a.tag === params.tag);
    }
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    return { list: list.slice(start, start + pageSize), total: list.length };
  }

  const search = new URLSearchParams();
  if (params?.tag) search.set('tag', params.tag);
  if (params?.page) search.set('page', String(params.page));
  if (params?.pageSize) search.set('pageSize', String(params.pageSize));
  return api.get<{ list: Article[]; total: number }>(`/articles?${search}`);
}

export async function fetchArticleById(id: number): Promise<Article | null> {
  if (USE_MOCK) {
    await delay();
    return MOCK_ARTICLES.find(a => a.id === id) || null;
  }
  return api.get<Article>(`/articles/${id}`);
}
