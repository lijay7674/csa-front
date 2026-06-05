import { Link } from 'react-router-dom';

const FAQS = [
  { q: '如何加入 CSA？', a: '关注每学年初的招新公告，通过报名中心提交报名表，我们会在一周内联系你安排面试。' },
  { q: '需要编程基础吗？', a: '不需要！CSA 设有零基础培训计划，从编程入门到项目实战都有对应的学习路径。' },
  { q: '招新时间是什么时候？', a: '通常在每学年开学后 2-4 周内进行，具体时间请关注官网公告。' },
  { q: '可以同时参加多个部门吗？', a: '可以，但建议先专注一个方向打好基础，后续可以根据兴趣调整。' },
];

export default function Recruitment() {
  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'var(--page-header-bg)' }}>
        <h1 className="font-heading text-4xl font-extrabold mb-4" style={{ color: 'var(--page-header-text)' }}>招新信息</h1>
        <p className="text-lg opacity-70" style={{ color: 'var(--page-header-text)' }}>加入我们，一起 Coding the Future</p>
      </section>

      <div className="max-w-[900px] mx-auto px-6 py-16">
        {/* 招新要求 */}
        <Section title="招新对象">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            面向全校各年级、各专业学生。无论你是编程大神还是零基础小白，只要你热爱技术、乐于分享，CSA 都欢迎你。
          </p>
        </Section>

        <Section title="招新要求">
          <ul className="space-y-3 text-lg" style={{ color: 'var(--text-secondary)' }}>
            {['对计算机技术有浓厚兴趣', '有团队协作精神和学习热情', '能够积极参与学会活动和项目', '愿意分享知识、帮助他人'].map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span style={{ color: 'var(--accent)' }}>✦</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="招新流程">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: '在线报名', desc: '填写报名表，选择技术方向' },
              { step: '02', title: '面试交流', desc: '与学长学姐面对面交流' },
              { step: '03', title: '结果通知', desc: '短信/邮件通知面试结果' },
              { step: '04', title: '加入 CSA', desc: '参加迎新会，开启技术之旅' },
            ].map(item => (
              <div key={item.step} className="card-base p-6 text-center">
                <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--accent)' }}>{item.step}</div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="常见问题">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="card-base overflow-hidden">
                <summary className="p-5 cursor-pointer font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                  {faq.q}
                </summary>
                <div className="px-5 pb-5" style={{ color: 'var(--text-secondary)' }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </Section>

        <div className="text-center mt-12">
          <Link to="/register/recruit" className="btn-primary text-lg px-10 py-4">🙌 立即报名</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        <span className="w-1 h-6 rounded-full" style={{ background: 'var(--accent)' }} />
        {title}
      </h2>
      {children}
    </section>
  );
}
