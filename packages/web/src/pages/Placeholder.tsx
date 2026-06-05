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

export function CompetitionResults() { return <PlaceholderPage title="竞赛成果" desc="展示学会历年的竞赛成绩与荣誉" />; }
export function RegisterQuery() { return <PlaceholderPage title="报名查询" desc="输入手机号、学号或报名编号查询报名状态" />; }
