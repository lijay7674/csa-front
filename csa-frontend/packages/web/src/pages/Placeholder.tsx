import { useScrollReveal } from '../hooks/useScrollReveal';

function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  const ref = useScrollReveal();
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-24" ref={ref}>
      <div className="card-base p-16 text-center reveal visible">
        <h1 className="font-heading text-3xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{desc}</p>
        <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>🚧 页面建设中，敬请期待...</p>
      </div>
    </div>
  );
}

export function About() { return <PlaceholderPage title="学会简介" desc="了解 CSA 的发展历程、组织架构和宗旨目标" />; }
export function CompetitionNotices() { return <PlaceholderPage title="竞赛公告" desc="查看最新竞赛通知、选拔公告和报名截止信息" />; }
export function CompetitionResults() { return <PlaceholderPage title="竞赛成果" desc="展示学会历年的竞赛成绩与荣誉" />; }
export function Members() { return <PlaceholderPage title="优秀成员" desc="认识 CSA 的优秀成员和骨干力量" />; }
export function Tech() { return <PlaceholderPage title="技术资讯" desc="精选技术文章、学习资源和行业动态" />; }
export function QuestionBank() { return <PlaceholderPage title="历史题库" desc="历年竞赛题库、培训资料和题目下载" />; }
export function Recruitment() { return <PlaceholderPage title="招新信息" desc="了解招新要求、流程和常见问题" />; }
export function RegisterQuery() { return <PlaceholderPage title="报名查询" desc="输入手机号、学号或报名编号查询报名状态" />; }
export function Contact() { return <PlaceholderPage title="联系我们" desc="邮箱、公众号、QQ群等联系方式" />; }
