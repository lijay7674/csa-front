import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { submitRegistration, queryRegistration, fetchPublicEvents, fetchPublicCompetitions } from '../api/public';
import type { RegistrationType, TeamMode, RegistrationForm } from '@csa/shared';
import { TARGET_TYPES } from '@csa/shared';

const FORM_TITLES: Record<RegistrationType, string> = { recruit: '招新报名', activity: '活动报名', competition: '竞赛报名' };

type ViewMode = 'hub' | 'form' | 'query';

export default function Register() {
  const { type } = useParams<{ type?: string }>();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // 有 type 参数则直接进入表单
    if (type && ['recruit', 'activity', 'competition'].includes(type)) return 'form';
    if (window.location.pathname.includes('/query')) return 'query';
    return 'hub';
  });

  const paramsFromUrl = {
    regType: (type as RegistrationType) || 'recruit',
    targetType: type === 'recruit' ? 'member' : type === 'activity' ? 'event' : type === 'competition' ? 'competition' : 'member',
    targetId: Number(searchParams.get('targetId')) || 0,
    targetName: searchParams.get('targetName') || '',
  };

  if (viewMode === 'query') {
    return <QueryView onBack={() => setViewMode('hub')} />;
  }

  if (viewMode === 'form') {
    return <FormView params={paramsFromUrl} onBack={() => setViewMode('hub')} />;
  }

  return <HubView onForm={(t: RegistrationType) => setViewMode('form')} onQuery={() => setViewMode('query')} />;
}

// ================================================================
// Hub: 报名中心入口
// ================================================================
function HubView({ onForm, onQuery }: { onForm: (t: RegistrationType) => void; onQuery: () => void }) {
  const items = [
    { icon: '🎓', title: '招新报名', desc: '加入 CSA，成为我们的一员', type: 'recruit' as const, href: '/register/recruit' },
    { icon: '📅', title: '活动报名', desc: '查看可报名活动并报名', type: 'activity' as const, href: '/register/activity' },
    { icon: '🏆', title: '竞赛报名', desc: '查看可报名竞赛并报名', type: 'competition' as const, href: '/register/competition' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold text-center mb-2" style={{ color: 'var(--text-primary)' }}>报名中心</h1>
      <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>选择你需要报名的项目</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <a
            key={item.title}
            href={item.href}
            className="card-base p-10 text-center cursor-pointer group relative overflow-hidden no-underline block"
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
          </a>
        ))}
      </div>
      <div className="text-center mt-10">
        <button onClick={onQuery} className="btn-outline text-sm">
          🔍 查询我的报名状态
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Form: 报名表单（支持 URL 参数）
// ================================================================
function FormView({ params, onBack }: { params: { regType: RegistrationType; targetType: string; targetId: number; targetName: string }; onBack: () => void }) {
  const [formType, setFormType] = useState<RegistrationType>(params.regType);
  const [step, setStep] = useState(1);
  const [teamMode, setTeamMode] = useState<TeamMode>('individual');
  const [form, setForm] = useState({ name: '', studentId: '', phone: '', major: '', direction: '', teamName: '', remark: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [regNo, setRegNo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 活动/竞赛下拉选择
  const [targetItems, setTargetItems] = useState<{ id: number; label: string }[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<number>(params.targetId);
  const [selectedTargetName, setSelectedTargetName] = useState<string>(params.targetName);

  useEffect(() => {
    if (formType === 'recruit') return;
    const fetcher = formType === 'activity' ? fetchPublicEvents : fetchPublicCompetitions;
    const params = formType === 'activity' ? { page: 1, size: 100, status: 'PUBLISHED' } : { page: 1, size: 100 };
    fetcher(params).then(res => {
      const items = (res.records || []).map(r => ({
        id: Number(r.id),
        label: String(r.title || r.name),
      }));
      setTargetItems(items);
    }).catch(() => setTargetItems([]));
  }, [formType]);

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '请填写姓名';
    if (formType !== 'recruit' && !selectedTargetId) e.target = '请选择要报名的项目';
    if (!form.studentId.trim()) e.studentId = '请填写学号';
    if (!form.phone.trim()) e.phone = '请填写手机号';
    else if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) e.phone = '手机号格式不正确';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    if (step === 2) { handleSubmit(); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');

    const targetType = (formType === 'recruit' ? TARGET_TYPES.MEMBER : formType === 'activity' ? TARGET_TYPES.EVENT : TARGET_TYPES.COMPETITION).toUpperCase();
    const targetId = formType === 'recruit' ? 0 : selectedTargetId;

    const regForm: RegistrationForm = {
      targetType,
      targetId,
      regType: teamMode === 'team' ? 'TEAM' : 'PERSONAL',
      name: form.name,
      studentId: form.studentId,
      phone: form.phone,
      ...(formType === 'recruit' ? { direction: form.direction } : {}),
      ...(formType === 'competition' && teamMode === 'team' ? { teamName: form.teamName } : {}),
    };

    try {
      const result = await submitRegistration(regForm);
      setRegNo(result.regNo);
      setStep(3);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = selectedTargetName || params.targetName || FORM_TITLES[formType];

  return (
    <div className="max-w-[680px] mx-auto px-6 py-12">
      {/* 类型选择 */}
      <div className="flex justify-center gap-4 mb-8">
        {(['recruit', 'activity', 'competition'] as const).map(t => (
          <button key={t} onClick={() => setFormType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${formType === t ? 'text-white' : ''}`}
            style={formType === t ? { background: 'var(--accent)' } : { color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
            {FORM_TITLES[t]}
          </button>
        ))}
      </div>

      <h2 className="font-heading text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>{pageTitle}</h2>
      {(selectedTargetName || params.targetName) && (
        <p className="text-center text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          您正在报名：<strong>{selectedTargetName || params.targetName}</strong>
        </p>
      )}

      {/* Step indicator */}
      <div className="flex justify-center mb-10 relative">
        <div className="absolute top-[18px] left-[calc(50%-160px)] w-[320px] h-0.5" style={{ background: 'var(--border)' }} />
        <div className="absolute top-[18px] left-[calc(50%-160px)] h-0.5 rounded-sm transition-all duration-500"
          style={{ background: 'var(--accent)', width: step === 1 ? 0 : step === 2 ? 160 : 320 }} />
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center w-[120px] relative z-10">
            <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors"
              style={step >= s ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }
                : { borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
              {step > s ? '✓' : s}
            </div>
            <span className="text-xs mt-2" style={{ color: step >= s ? 'var(--accent)' : 'var(--text-muted)' }}>
              {s === 1 ? '填写信息' : s === 2 ? '确认提交' : '完成'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          {/* 活动/竞赛选择 */}
          {formType !== 'recruit' && (
            <Field label={formType === 'activity' ? '选择活动' : '选择竞赛'} required>
              <select className="input" value={selectedTargetId} onChange={e => {
                const id = Number(e.target.value);
                setSelectedTargetId(id);
                const item = targetItems.find(x => x.id === id);
                setSelectedTargetName(item?.label || '');
              }}>
                <option value="">请选择{formType === 'activity' ? '活动' : '竞赛'}</option>
                {targetItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          )}

          {formType === 'competition' && (
            <div className="flex rounded-lg overflow-hidden mb-4" style={{ background: 'var(--bg-secondary)' }}>
              {(['individual', 'team'] as const).map(m => (
                <button key={m} onClick={() => setTeamMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors`}
                  style={teamMode === m ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-muted)' }}>
                  {m === 'individual' ? '🧑 个人报名' : '👥 团队报名'}
                </button>
              ))}
            </div>
          )}
          {formType === 'competition' && teamMode === 'team' && (
            <Field label="团队名称" required>
              <input className="input" placeholder="请输入团队名称" value={form.teamName} onChange={e => updateField('teamName', e.target.value)} />
            </Field>
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
              <input className={`input ${errors.phone ? 'border-red-500' : ''}`} placeholder="请输入手机号" value={form.phone} onChange={e => updateField('phone', e.target.value)} type="tel" />
            </Field>
            <Field label="专业">
              <input className="input" placeholder="请输入专业" value={form.major} onChange={e => updateField('major', e.target.value)} />
            </Field>
          </div>
          {formType === 'recruit' && (
            <Field label="技术方向">
              <select className="input" value={form.direction} onChange={e => updateField('direction', e.target.value)}>
                <option value="">请选择</option>
                <option value="frontend">前端开发</option><option value="backend">后端开发</option>
                <option value="algorithm">算法竞赛</option><option value="ai">AI/ML</option>
                <option value="design">UI设计</option><option value="other">其他</option>
              </select>
            </Field>
          )}
          <Field label="备注">
            <textarea className="input min-h-[80px]" placeholder="如有特殊说明请填写" value={form.remark} onChange={e => updateField('remark', e.target.value)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="card-base p-6">
          <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>请确认以下信息</h4>
          {[
            ['报名类型', FORM_TITLES[formType]],
            ...(params.targetName ? [['报名项目', params.targetName]] as const : []),
            ['姓名', form.name],
            ['学号', form.studentId],
            ['手机号', form.phone],
            ['专业', form.major || '未填写'],
            ...(formType === 'recruit' ? [['技术方向', form.direction || '未选择']] as const : []),
            ...(formType === 'competition' && teamMode === 'team' ? [['团队名称', form.teamName]] as const : []),
            ['备注', form.remark || '无'],
          ].map(([label, value], i) => (
            <div key={i} className="flex justify-between py-2.5 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
          {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>报名提交成功！</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>您的报名编号为：</p>
          <div className="inline-block px-5 py-2 rounded-lg font-mono text-xl font-bold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
            {regNo}
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>请保存此编号，可用于后续查询报名状态。</p>
        </div>
      )}

      {step < 3 && (
        <div className="flex justify-center gap-4 mt-8">
          {step > 1 && !submitting && <button onClick={() => setStep(s => s - 1)} className="btn-outline">← 上一步</button>}
          <button onClick={handleNext} disabled={submitting} className="btn-primary">
            {submitting ? '提交中...' : step === 2 ? '确认提交 ✓' : '下一步 →'}
          </button>
        </div>
      )}
      <div className="text-center mt-6">
        <button onClick={onBack} className="btn-outline text-sm">← 返回报名中心</button>
      </div>
    </div>
  );
}

// ================================================================
// Query: 报名查询
// ================================================================
function QueryView({ onBack }: { onBack: () => void }) {
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [regNo, setRegNo] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    if (!phone.trim() && !studentId.trim() && !regNo.trim()) { setError('请至少填写一项查询信息'); return; }
    setLoading(true); setError(''); setResult(null); setNotFound(false);
    try {
      const res = await queryRegistration({ phone: phone.trim() || undefined, studentId: studentId.trim() || undefined, regNo: regNo.trim() || undefined });
      if (res) setResult(res as unknown as typeof result);
      else setNotFound(true);
    } catch (err) { setError(err instanceof Error ? err.message : '查询失败'); }
    finally { setLoading(false); }
  };

  const statusLabel: Record<string, string> = { pending: '待审核', PENDING: '待审核', approved: '已通过', APPROVED: '已通过', rejected: '已拒绝', REJECTED: '已拒绝' };
  const statusBg: Record<string, string> = { pending: '#FEF3C7', PENDING: '#FEF3C7', approved: '#DCFCE7', APPROVED: '#DCFCE7', rejected: '#FEE2E2', REJECTED: '#FEE2E2' };
  const statusColor: Record<string, string> = { pending: '#92400E', PENDING: '#92400E', approved: '#166534', APPROVED: '#166534', rejected: '#991B1B', REJECTED: '#991B1B' };

  return (
    <div className="max-w-[520px] mx-auto px-6 py-16">
      <div className="card-base p-8">
        <h2 className="font-heading text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>报名查询</h2>
        <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>任填一项即可查询</p>
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>手机号</label><input className="input" placeholder="请输入报名时填写的手机号" value={phone} onChange={e => setPhone(e.target.value)} type="tel" /></div>
          <div><label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>学号</label><input className="input" placeholder="请输入学号" value={studentId} onChange={e => setStudentId(e.target.value)} /></div>
          <div><label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>报名编号</label><input className="input" placeholder="如 CSAXXXX" value={regNo} onChange={e => setRegNo(e.target.value)} /></div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        <button onClick={handleQuery} disabled={loading} className="btn-primary w-full justify-center mt-6">{loading ? '查询中...' : '查询'}</button>
        {result && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>查询结果</h4>
            <div className="space-y-3">
              {[['报名编号', String(result.regNo)], ['姓名', String(result.name)], ...(result.regType ? [['类型', String(result.regType)]] as [string, string][] : [])].map(([label, value], i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span><span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span></div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>审核状态</span>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: statusBg[String(result.status)] || '#F1F5F9', color: statusColor[String(result.status)] || '#475569' }}>{statusLabel[String(result.status)] || String(result.status)}</span>
              </div>
              {result.reviewComment ? <div className="flex justify-between items-center"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>审核意见</span><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(result.reviewComment)}</span></div> : null}
            </div>
          </div>
        )}
        {notFound && <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}><p className="text-sm" style={{ color: 'var(--text-muted)' }}>未找到匹配的报名记录</p></div>}
      </div>
      <div className="text-center mt-6"><button onClick={onBack} className="btn-outline text-sm">← 返回报名中心</button></div>
    </div>
  );
}

// ================================================================
// 通用组件
// ================================================================
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
