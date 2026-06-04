export default function PublicFooter() {
  return (
    <footer
      className="relative z-10 py-12 text-center border-t"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          <p className="font-bold">CSA 计算机软件学会</p>
          <p className="text-sm mt-1">邮箱：csa@school.edu.cn | 地址：闽南科技学院</p>
          <p className="text-sm">关注我们：微信公众号 | QQ群：575225360</p>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          &copy; 2026 CSA Computer Software Association. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
