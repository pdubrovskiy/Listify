package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/handlers"
)

func SetupTodoRoutes(app *fiber.App) {
	todoHandler := handlers.NewTodoHandler()

	app.Get("/api/todos", todoHandler.GetTodos)
	app.Post("/api/todos", todoHandler.CreateTodo)
	app.Patch("/api/todos/:id", todoHandler.CompleteTodo)
	app.Delete("/api/todos/:id", todoHandler.DeleteTodo)
}
