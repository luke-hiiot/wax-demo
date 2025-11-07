import Layout from "./layout.tsx";
import FruitList from "../components/FruitList";
import RecentMessages from "../components/RecentMessages";

export default function Hello(model: {
    name: string,
    message: string,
    cssUrl: string,
    showMessage?: string,
    recentMessages?: string[],
}) {
    return <Layout title="WAX + Gin Demo" cssUrl={model.cssUrl}>
        <div class="card space-y-8">
            <section class="space-y-2">
                <p class="text-sm font-semibold uppercase tracking-widest text-brand">Wax + Tailwind</p>
                <h1 class="text-4xl font-semibold text-slate-900">Hello, {model.name}!</h1>
                <p class="text-lg text-slate-600">{model.message}</p>
            </section>

            {model.showMessage && (
                <div class="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900 shadow-inner">
                    <p class="text-sm font-medium">您刚提交的消息：</p>
                    <p class="text-lg font-semibold">{model.showMessage}</p>
                </div>
            )}

            <form action="/message" method="post" class="space-y-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6">
                <div class="space-y-2">
                    <label class="field-label" htmlFor="message">消息内容</label>
                    <textarea id="message" name="message" rows={4} required class="text-input" placeholder="分享你的想法..." />
                </div>
                <button type="submit" class="btn-primary">提交消息</button>
            </form>

            <section class="grid gap-4 md:grid-cols-2">
                <FruitList />
                <RecentMessages recentMessages={model.recentMessages} />
            </section>
        </div>
    </Layout>;
}
