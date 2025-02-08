package handlers

import (
	"fmt"
	"slices"

	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/models"
)

type TodoHandler struct {
	todos []models.Todo
}

func NewTodoHandler() *TodoHandler {
	return &TodoHandler{
		todos: []models.Todo{},
	}
}

func (h *TodoHandler) GetTodos(c *fiber.Ctx) error {
	return c.Status(200).JSON(h.todos)
}

func (h *TodoHandler) CreateTodo(c *fiber.Ctx) error {
	todo := &models.Todo{}

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
	}

	todo.ID = len(h.todos) + 1
	h.todos = append(h.todos, *todo)

	return c.Status(201).JSON(todo)
}

func (h *TodoHandler) CompleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	for i, todo := range h.todos {
		if fmt.Sprint(todo.ID) == id {
			h.todos[i].Completed = true
			return c.Status(200).JSON(h.todos[i])
		}
	}

	return c.Status(400).JSON(fiber.Map{"error": "Todo not found"})
}

func (h *TodoHandler) DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	for i, todo := range h.todos {
		if fmt.Sprint(todo.ID) == id {
			h.todos = slices.Delete(h.todos, i, i+1)
			return c.Status(200).JSON(fiber.Map{"message": "Todo deleted"})
		}
	}

	return c.Status(400).JSON(fiber.Map{"error": "Todo not found"})
}
