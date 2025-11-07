export default function Layout(model: { title: string, cssUrl: string, children: any }) {
    return <html>
        <head>
            <title>{model.title}</title>
            <link rel="stylesheet" href={model.cssUrl} />
        </head>
        <body>
            <div className="container">
                {model.children}
            </div>
        </body>
    </html>;
}