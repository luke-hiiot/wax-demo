export default function InteractiveCounter({ initial }: { initial: number }) {
    // 在服务端组件中，我们不能使用客户端的交互状态
    // 这里创建一个简单的静态显示
    return (
        <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">交互计数器</h3>
            <div class="mt-3 space-y-2 text-sm text-slate-600">
                <p>计数: {initial}</p>
                <p class="text-xs text-slate-400 mt-2">注意: 这是服务端渲染的静态展示，需要客户端组件实现交互功能</p>
            </div>
        </div>
    );
}