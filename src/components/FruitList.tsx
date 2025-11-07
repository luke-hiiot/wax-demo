export default function FruitList() {
    const fruits = ["Apple", "Orange", "Banana"];

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">水果列表示例</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {fruits.map(fruit => (
                    <li key={fruit} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        {fruit}
                    </li>
                ))}
            </ul>
        </div>
    );
}