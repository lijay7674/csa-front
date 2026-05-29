export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--admin-text)' }}>
        {title}
      </h2>
      <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
        模块开发中，敬请期待...
      </p>
    </div>
  );
}
