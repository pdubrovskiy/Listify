package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/handlers"
)

func SetupRoutes(app *fiber.App) {
	todoHandler := handlers.NewTodoHandler()

	// API v1 routes
	v1 := app.Group("/api/v1")

	v1.Get("/todos", todoHandler.GetTodos)
	v1.Post("/todos", todoHandler.CreateTodo)
	v1.Patch("/todos/:id", todoHandler.UpdateTodo)
	v1.Delete("/todos/:id", todoHandler.DeleteTodo)
}
