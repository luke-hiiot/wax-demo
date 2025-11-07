package main

import (
	"log"
	"net/http"
	"os"

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
	r.Static("/static", "./static")

	// 指定视图文件位置
	viewsFS := os.DirFS("./views")

	// 实例化 WAX 引擎
	viewResolver := wax.NewFsViewResolver(viewsFS)
	renderer := wax.New(viewResolver)

	// 定义根路由
	r.GET("/", func(c *gin.Context) {
		// 获取可能的消息参数
		showMessage := c.Query("message")

		err := renderer.Render(c.Writer,
			// 渲染 Hello 视图
			"Hello",
			// 传递模型（视图参数）
			map[string]any{
				"name":           "World",
				"message":        "Welcome to WAX + Gin demo!",
				"cssUrl":         "/static/css/style.css",
				"showMessage":    showMessage,
				"recentMessages": messages,
			})
		if err != nil {
			log.Printf("渲染错误: %v", err)
			c.String(http.StatusInternalServerError, "内部服务器错误")
			return
		}
	})

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
	log.Println("服务器启动在 :3000")
	r.Run(":3000")
}
