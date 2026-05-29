const STATS = [
  { label: '待审核内容', value: 5, color: '#F59E0B', icon: '📝' },
  { label: '待审核报名', value: 12, color: '#3B82F6', icon: '📨' },
  { label: '已发布内容', value: 28, color: '#22C55E', icon: '✅' },
  { label: '注册成员', value: 86, color: '#8B5CF6', icon: '👥' },
];

const RECENT = [
  { title: 'LLM 大模型应用开发实战分享会', type: '新闻', status: '已发布', time: '2 小时前' },
  { title: '张三 - 招新报名', type: '报名', status: '待审核', time: '3 小时前' },
  { title: '蓝桥杯算法集训启动通知', type: '公告', status: '待审核', time: '5 小时前' },
  { title: 'React 全栈开发工作坊', type: '新闻', status: '草稿', time: '1 天前' },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--admin-text)' }}>
        Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(stat => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border"
            style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                {stat.label}
              </span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}
      >
        <div className="px-5 py-3 border-b font-semibold text-sm" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          最近动态
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--admin-border)' }}>
          {RECENT.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
                  {item.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-secondary)' }}>
                  {item.type} · {item.time}
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: item.status === '已发布' ? '#DCFCE7' : item.status === '待审核' ? '#FEF3C7' : '#F1F5F9',
                  color: item.status === '已发布' ? '#166534' : item.status === '待审核' ? '#92400E' : '#475569',
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
