export default function FruitList() {
    const fruits = ["Apple", "Orange", "Banana"];

    return (
        <div class="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">水果列表示例</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-600">
                {fruits.map(fruit => (
                    <li key={fruit} class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full bg-blue-500"></span>
                        {fruit}
                    </li>
                ))}
            </ul>
        </div>
    );
}
