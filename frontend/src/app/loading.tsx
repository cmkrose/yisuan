export default function Loading() {
  return (
    <div className="min-h-screen bg-xuan-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-xuan-gold/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-xuan-gold rounded-full animate-spin" />
        </div>
        <div className="flex gap-1.5">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-xuan-gold/60 animate-pulse"
              style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
        <span className="text-sm font-chinese text-xuan-muted">加载中...</span>
      </div>
    </div>
  );
}
