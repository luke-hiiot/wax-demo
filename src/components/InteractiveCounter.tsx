import HeartIcon from './HeartIcon';

export default function InteractiveCounter({ initial }: { initial: number }) {
    // 在服务端组件中，我们不能使用客户端的交互状态
    // 这里创建一个简单的静态显示
    return (
        <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-slate-900">交互计数器</h3>
                {/* SVG 组件方案 - 使用可重用的 HeartIcon 组件 */}
                <HeartIcon className="w-5 h-5 text-red-500" />
            </div>
            <div class="mt-3 space-y-2 text-sm text-slate-600">
                <p>计数: {initial}</p>
                {/* 直接在 JSX 中添加 SVG 的方案 - 内联 SVG */}
                <div class="flex items-center gap-2 mt-2">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="w-4 h-4 text-blue-500"
                    >
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                    </svg>
                    <span>内联 SVG 图标</span>
                </div>
                {/* 方案三：引用静态 SVG 文件 */}
                <div class="flex items-center gap-2 mt-2">
                    <img src="/images/star.svg" alt="Star Icon" className="w-4 h-4 text-yellow-500" />
                    <span>引用静态 SVG 文件</span>
                </div>
                {/* 方案四：引用静态 PNG 文件 */}
                <div class="flex items-center gap-2 mt-2">
                    <img src="/images/usdc.png" alt="Test PNG" className="w-4 h-4" />
                    <span>引用静态 PNG 文件</span>
                </div>
                <p class="text-xs text-slate-400 mt-2">注意: 这是服务端渲染的静态展示，需要客户端组件实现交互功能</p>
            </div>
        </div>
    );
}