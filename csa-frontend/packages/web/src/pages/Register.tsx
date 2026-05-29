import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RegistrationType, TeamMode } from '@csa/shared';

const FORM_TITLES: Record<RegistrationType, string> = { recruit: '招新报名', activity: '活动报名', competition: '竞赛报名' };

export default function Register() {
  const [formType, setFormType] = useState<RegistrationType | null>(null);
  const [step, setStep] = useState(1);
  const [teamMode, setTeamMode] = useState<TeamMode>('individual');
  const [form, setForm] = useState({ name: '', studentId: '', phone: '', major: '', direction: '', teamName: '', remark: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!formType) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <h1 className="font-heading text-3xl font-extrabold text-center mb-2" style={{ color: 'var(--text-primary)' }}>报名中心</h1>
        <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>选择你需要报名的项目</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([
            { type: 'recruit' as const, icon: '🎓', title: '招新报名', desc: '加入 CSA，成为我们的一员' },
            { type: 'activity' as const, icon: '📅', title: '活动报名', desc: '查看可报名活动列表并报名' },
            { type: 'competition' as const, icon: '🏆', title: '竞赛报名', desc: '查看可报名竞赛并报名' },
          ]).map(item => (
            <div
              key={item.type}
              onClick={() => { setFormType(item.type); setStep(1); setErrors({}); }}
              className="card-base p-10 text-center cursor-pointer group relative overflow-hidden"
              style={{ borderWidth: '2px' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'radial-gradient(circle at 50% -10%, var(--accent-glow), transparent 60%)' }} />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                <span className="inline-block mt-4 font-bold text-sm group-hover:translate-x-1 transition-transform"
                  style={{ color: 'var(--accent)' }}>立即报名 →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '请填写姓名';
    if (!form.studentId.trim()) e.studentId = '请填写学号';
    if (!form.phone.trim()) e.phone = '请填写手机号';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    if (step === 2) { setStep(3); return; }
    setStep(s => s + 1);
  };

  const regNumber = 'CSA' + Date.now().toString(36).toUpperCase().slice(-8);

  return (
    <div className="max-w-[680px] mx-auto px-6 py-12">
      <h2 className="font-heading text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        {FORM_TITLES[formType]}
      </h2>
      <p className="text-center text-sm mb-10" style={{ color: 'var(--text-muted)' }}>填写以下信息完成报名</p>

      {/* Step indicator */}
      <div className="flex justify-center mb-10 relative">
        <div className="absolute top-[18px] left-[calc(50%-160px)] w-[320px] h-0.5" style={{ background: 'var(--border)' }} />
        <div className="absolute top-[18px] left-[calc(50%-160px)] h-0.5 rounded-sm transition-all duration-500"
          style={{ background: 'var(--accent)', width: step === 1 ? 0 : step === 2 ? 160 : 320 }} />
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center w-[120px] relative z-10">
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? 'text-white border-[var(--accent)]' : ''
            }`}
              style={step >= s ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
              {s}
            </div>
            <span className={`text-xs mt-2 ${step === s ? 'font-semibold' : ''}`}
              style={{ color: step >= s ? 'var(--accent)' : 'var(--text-muted)' }}>
              {s === 1 ? '填写信息' : s === 2 ? '确认提交' : '完成'}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5 animate-[fadeInUp_0.5s_ease]">
          {formType === 'competition' && (
            <div className="flex rounded-lg overflow-hidden mb-4" style={{ background: 'var(--bg-secondary)' }}>
              {(['individual', 'team'] as const).map(m => (
                <button key={m} onClick={() => setTeamMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${teamMode === m ? 'text-white' : ''}`}
                  style={teamMode === m ? { background: 'var(--accent)' } : { color: 'var(--text-muted)' }}>
                  {m === 'individual' ? '🧑 个人报名' : '👥 团队报名'}
                </button>
              ))}
            </div>
          )}
          {formType === 'competition' && teamMode === 'team' && (
            <Field label="团队名称" required><input className="input" placeholder="请输入团队名称" value={form.teamName} onChange={e => updateField('teamName', e.target.value)} /></Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="姓名" required error={errors.name}>
              <input className={`input ${errors.name ? 'border-red-500' : ''}`} placeholder="请输入姓名" value={form.name} onChange={e => updateField('name', e.target.value)} />
            </Field>
            <Field label="学号" required error={errors.studentId}>
              <input className={`input ${errors.studentId ? 'border-red-500' : ''}`} placeholder="请输入学号" value={form.studentId} onChange={e => updateField('studentId', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="手机号" required error={errors.phone}>
              <input className={`input ${errors.phone ? 'border-red-500' : ''}`} placeholder="请输入手机号" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
            </Field>
            <Field label="专业"><input className="input" placeholder="请输入专业" value={form.major} onChange={e => updateField('major', e.target.value)} /></Field>
          </div>
          {formType === 'recruit' && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="技术方向">
                <select className="input" value={form.direction} onChange={e => updateField('direction', e.target.value)}>
                  <option value="">请选择</option>
                  <option value="frontend">前端开发</option><option value="backend">后端开发</option>
                  <option value="algorithm">算法竞赛</option><option value="ai">AI/ML</option>
                  <option value="design">UI设计</option><option value="other">其他</option>
                </select>
              </Field>
            </div>
          )}
          <Field label="备注">
            <textarea className="input min-h-[80px]" placeholder="如有特殊说明请填写" value={form.remark} onChange={e => updateField('remark', e.target.value)} />
          </Field>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card-base p-6 animate-[fadeInUp_0.5s_ease]">
          <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>请确认以下信息</h4>
          {[
            ['报名类型', FORM_TITLES[formType]], ['姓名', form.name], ['学号', form.studentId],
            ['手机号', form.phone], ['专业', form.major || '未填写'],
            ...(formType === 'recruit' ? [['技术方向', form.direction || '未选择']] as const : []),
            ...(formType === 'competition' && teamMode === 'team' ? [['团队名称', form.teamName]] as const : []),
            ['备注', form.remark || '无'],
          ].map(([label, value], i) => (
            <div key={i} className="flex justify-between py-2.5 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center py-12 animate-[fadeInUp_0.5s_ease]">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>报名提交成功！</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>您的报名编号为：</p>
          <div className="inline-block px-5 py-2 rounded-lg font-mono text-xl font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
            {regNumber}
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            请保存此编号，可用于后续查询报名状态。<br />我们将在 3-5 个工作日内与您联系。
          </p>
        </div>
      )}

      {/* Actions */}
      {step < 3 && (
        <div className="flex justify-center gap-4 mt-8">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn-outline">← 上一步</button>}
          <button onClick={handleNext} className="btn-primary">
            {step === 2 ? '确认提交 ✓' : '下一步 →'}
          </button>
        </div>
      )}
      <div className="text-center mt-6">
        <button onClick={() => setFormType(null)} className="btn-outline text-sm">← 返回报名中心</button>
      </div>
    </div>
  );
}

/* Field component */
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
