import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div
        className="font-mono text-[8rem] font-extrabold leading-none mb-4 opacity-20"
        style={{ color: 'var(--accent)' }}
      >
        404
      </div>
      <h1 className="font-heading text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        页面未找到
      </h1>
      <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
        你访问的页面不存在或已被移除
      </p>
      <Link to="/">
        <Button variant="outline">← 返回首页</Button>
      </Link>
    </div>
  );
}
