import Layout from "./layout";

export default function Hello(model: { name: string, message: string, cssUrl: string, showMessage?: string }) {
    return <Layout title="WAX + Gin Demo" cssUrl={model.cssUrl}>
        <h1>Hello, {model.name}!</h1>
        <p>{model.message}</p>
        
        {/* 显示提交的消息 */}
        {model.showMessage && (
            <div style="background-color: #d4edda; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <strong>您提交的消息:</strong> {model.showMessage}
            </div>
        )}
        
        {/* 消息提交表单 */}
        <form action="/message" method="post" style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
            <h3>发送消息</h3>
            <div style="margin-bottom: 10px;">
                <label htmlFor="message">消息内容:</label><br/>
                <textarea id="message" name="message" rows={4} cols={50} required style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; border: 1px solid #ccc;"></textarea>
            </div>
            <button type="submit" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">提交消息</button>
        </form>
        
        <ul>
            {["Apple", "Orange", "Banana"].map(fruit => <li key={fruit}>{fruit}</li>)}
        </ul>
    </Layout>;
}