export default function RecentMessages({ recentMessages }: { recentMessages?: string[] }) {
    return (
        <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">最近提交</h3>
            {recentMessages && recentMessages.length > 0 ? (
                <ul class="mt-3 space-y-2 text-sm text-slate-600">
                    {recentMessages.slice(-5).reverse().map((msg, idx) => (
                        <li key={`${msg}-${idx}`} class="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 shadow-inner">
                            {msg}
                        </li>
                    ))}
                </ul>
            ) : (
                <p class="mt-3 text-sm text-slate-500">还没有消息，快来留下你的第一条吧！</p>
            )}
        </div>
    );
}
