package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/michal-laskowski/wax"
)

// 用于存储消息的简单内存存储
var messages []string

func main() {
	// 设置 Gin 运行模式
	gin.SetMode(gin.ReleaseMode)

	// 创建 Gin 路由器
	r := gin.New()

	// 添加日志和恢复中间件
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// 提供静态文件服务
	r.Static("/static", "./public")
	r.Static("/images", "./public/images")

	// 指定视图文件位置（对标 Next.js src/ 约定）
	viewRoot := "./src"
	viewsFS := os.DirFS(viewRoot)

	// 实例化 WAX 引擎
	// 在生产环境中禁用开发优化
	isDev := os.Getenv("WAX_ENV") != "production"
	viewResolver := wax.NewFsViewResolver(viewsFS)
	
	// 仅在开发环境中启用缓存目录
	var options []wax.Option
	if isDev {
		options = append(options, wax.WithCacheDir("./.wax-cache"))
	}
	renderer := wax.New(viewResolver, options...)

	// 仅在开发环境启用预编译优化
	if isDev {
		// 预编译所有页面以提高启动速度
		log.Println("开始预编译页面...")
		if err := precompileViews(renderer, viewResolver); err != nil {
			log.Printf("预编译警告: %v", err)
		} else {
			log.Println("页面预编译完成")
		}
	}

	appDir := filepath.Join(viewRoot, "app")
	routes, err := discoverRoutes(appDir)
	if err != nil {
		log.Fatalf("解析路由失败: %v", err)
	}
	registerRoutes(r, renderer, routes)

	// 处理表单提交
	r.POST("/message", func(c *gin.Context) {
		// 获取表单数据
		message := c.PostForm("message")

		// 验证消息
		if message == "" {
			c.String(http.StatusBadRequest, "消息内容不能为空")
			return
		}

		// 简单存储消息
		messages = append(messages, message)
		log.Printf("收到新消息: %s", message)

		// 重定向回首页并显示消息
		c.Redirect(http.StatusFound, "/?message="+message)
	})

	// 启动服务器
	log.Println("服务器启动在 http://127.0.0.1:3000/ ")
	r.Run(":3000")
}

type routeDef struct {
	Path string
	View string
}

func registerRoutes(r *gin.Engine, renderer *wax.Engine, routes []routeDef) {
	if len(routes) == 0 {
		log.Println("未发现任何 page.tsx 视图，跳过路由注册")
		return
	}
	for _, rt := range routes {
		rt := rt
		log.Printf("注册路由 %s -> %s", rt.Path, rt.View)
		r.GET(rt.Path, func(c *gin.Context) {
			model := baseModel(c)
			if provider, ok := pageModelProviders[rt.View]; ok {
				mergeModel(model, provider(c))
			}
			if err := renderer.Render(c.Writer, rt.View, model); err != nil {
				log.Printf("渲染错误 (%s): %v", rt.View, err)
				c.String(http.StatusInternalServerError, "内部服务器错误")
			}
		})
	}
}

func baseModel(c *gin.Context) map[string]any {
	model := map[string]any{
		"cssUrl": "/static/styles.css", // 默认 CSS URL
	}
	for _, param := range c.Params {
		model[param.Key] = param.Value
	}
	for key, vals := range c.Request.URL.Query() {
		switch len(vals) {
		case 0:
			continue
		case 1:
			model[key] = vals[0]
		default:
			model[key] = vals
		}
	}
	return model
}

func mergeModel(dst, src map[string]any) {
	for k, v := range src {
		dst[k] = v
	}
}

var pageModelProviders = map[string]func(*gin.Context) map[string]any{
	"app/page": func(c *gin.Context) map[string]any {
		return map[string]any{
			"name":           "World",
			"message":        "Welcome to WAX + Gin demo!",
			"showMessage":    c.Query("message"),
			"recentMessages": messages,
		}
	},
}

// 预编译所有页面以提高启动速度
func precompileViews(renderer *wax.Engine, viewResolver wax.ViewResolver) error {
	// 定义需要预编译的页面
	pages := []string{
		"app/page",
		"app/layout",
		"components/FruitList",
		"components/RecentMessages",
		"components/InteractiveCounter",
	}
	
	// 创建一个假的 writer 用于预编译
	fakeWriter := &fakeWriter{}
	
	// 预编译每个页面
	for _, page := range pages {
		log.Printf("预编译页面: %s", page)
		// 使用空模型进行预编译
		model := map[string]any{}
		if err := renderer.Render(fakeWriter, page, model); err != nil {
			// 记录错误但不中断预编译过程
			log.Printf("预编译页面 %s 时出错: %v", page, err)
		}
	}
	
	return nil
}

// fakeWriter 实现 io.Writer 接口，用于预编译时丢弃输出
type fakeWriter struct{}

func (fw *fakeWriter) Write(p []byte) (n int, err error) {
	return len(p), nil
}

func discoverRoutes(appDir string) ([]routeDef, error) {
	routes := make([]routeDef, 0)
	err := filepath.WalkDir(appDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		if !isPageFile(d.Name()) {
			return nil
		}
		rel, err := filepath.Rel(appDir, path)
		if err != nil {
			return err
		}
		viewName := filepath.ToSlash(filepath.Join("app", strings.TrimSuffix(rel, filepath.Ext(rel))))
		routePath := buildRoutePath(filepath.Dir(rel))
		routes = append(routes, routeDef{Path: routePath, View: viewName})
		return nil
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(routes, func(i, j int) bool {
		if routes[i].Path == routes[j].Path {
			return routes[i].View < routes[j].View
		}
		return routes[i].Path < routes[j].Path
	})
	return routes, nil
}

func isPageFile(name string) bool {
	name = strings.ToLower(name)
	return name == "page.tsx" || name == "page.jsx"
}

func buildRoutePath(relDir string) string {
	if relDir == "." || relDir == "" {
		return "/"
	}
	parts := strings.Split(filepath.ToSlash(relDir), "/")
	segments := make([]string, 0, len(parts))
	for _, part := range parts {
		seg := normalizeSegment(part)
		if seg == "" {
			continue
		}
		segments = append(segments, seg)
	}
	if len(segments) == 0 {
		return "/"
	}
	return "/" + strings.Join(segments, "/")
}

func normalizeSegment(segment string) string {
	if segment == "" {
		return ""
	}
	if strings.HasPrefix(segment, "(") && strings.HasSuffix(segment, ")") {
		return ""
	}
	if strings.HasPrefix(segment, "@") {
		return ""
	}
	if strings.HasPrefix(segment, "[[...") && strings.HasSuffix(segment, "]]") {
		name := segment[len("[[...") : len(segment)-len("]]")]
		return "*" + name
	}
	if strings.HasPrefix(segment, "[...") && strings.HasSuffix(segment, "]") {
		name := segment[len("[...") : len(segment)-len("]")]
		return "*" + name
	}
	if strings.HasPrefix(segment, "[") && strings.HasSuffix(segment, "]") {
		name := segment[1 : len(segment)-1]
		return ":" + name
	}
	return segment
}
