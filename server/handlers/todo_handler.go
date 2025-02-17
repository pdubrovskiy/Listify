package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/database"
	"github.com/pdubrovskiy/listify/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TodoHandler struct{}

func NewTodoHandler() *TodoHandler {
	return &TodoHandler{}
}

func (h *TodoHandler) GetTodos(c *fiber.Ctx) error {
	var todos []models.Todo
	filter := bson.M{}

	// Handle date filtering
	if date := c.Query("date"); date != "" {
		filter["date"] = date
	} else if start := c.Query("start"); start != "" {
		if end := c.Query("end"); end != "" {
			filter["date"] = bson.M{
				"$gte": start,
				"$lte": end,
			}
		}
	}

	cursor, err := database.TodoCollection.Find(context.Background(), filter)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error fetching todos"})
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &todos); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error parsing todos"})
	}

	if len(todos) == 0 {
		todos = []models.Todo{}
	}

	return c.Status(200).JSON(todos)
}

func (h *TodoHandler) CreateTodo(c *fiber.Ctx) error {
	todo := &models.Todo{}

	if err := c.BodyParser(todo); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
	}

	if todo.Date == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo date is required"})
	}

	// Validate date format
	_, err := time.Parse("2006-01-02", todo.Date)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid date format. Use YYYY-MM-DD"})
	}

	// Set timestamps
	currentTime := time.Now().UTC().Format(time.RFC3339)
	todo.CreatedAt = currentTime
	todo.UpdatedAt = currentTime

	result, err := database.TodoCollection.InsertOne(context.Background(), todo)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating todo"})
	}

	if id, ok := result.(primitive.ObjectID); ok {
		todo.ID = id
	}

	return c.Status(201).JSON(todo)
}

func (h *TodoHandler) UpdateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID format"})
	}

	var body struct {
		Completed bool `json:"completed"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	update := bson.M{
		"$set": bson.M{
			"completed": body.Completed,
			"updatedAt": time.Now().UTC().Format(time.RFC3339),
		},
	}

	result, err := database.TodoCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectId},
		update,
	)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Error updating todo"})
	}

	if result == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	updateResult, ok := result.(*mongo.UpdateResult)
	if !ok || updateResult.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Todo status updated successfully"})
}

func (h *TodoHandler) DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID format"})
	}

	result, err := database.TodoCollection.DeleteOne(context.Background(), bson.M{"_id": objectId})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Error deleting todo"})
	}

	if result == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	deleteResult, ok := result.(*mongo.DeleteResult)
	if !ok || deleteResult.DeletedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Todo deleted"})
}
