export default function Layout(model: { title: string, cssUrl?: string, children: any }) {
    return <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{model.title}</title>
            <link rel="stylesheet" href={model.cssUrl ?? "/static/styles.css"} />
        </head>
        <body class="bg-slate-100">
            <div class="px-4 py-12">
                <div class="mx-auto max-w-3xl">
                    {model.children}
                </div>
            </div>
        </body>
    </html>;
}
