export default function Contact() {
  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>联系我们</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>欢迎通过各种渠道与我们交流</p>
      </section>

      <div className="max-w-[900px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: '📧', label: '电子邮箱', value: 'csa@school.edu.cn' },
            { icon: '📱', label: '微信公众号', value: 'CSA 计算机学会' },
            { icon: '💬', label: 'QQ 群', value: '123456789' },
            { icon: '📍', label: '办公地点', value: '实训楼 501' },
          ].map(item => (
            <div key={item.label} className="card-base p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: 'var(--accent-light)' }}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-base p-8 text-center">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>加入我们的社区</h3>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            关注 CSA 微信公众号，获取最新活动通知、技术文章和竞赛资讯。
            加入 QQ 群与学长学姐实时交流技术问题。
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-6 py-3 rounded-full font-semibold text-sm" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
              📱 微信公众号
            </span>
            <span className="px-6 py-3 rounded-full font-semibold text-sm" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
              💬 QQ 群
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
