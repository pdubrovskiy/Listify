package handlers

import (
	"bytes"
	"context"
	"errors"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/database"
	"github.com/pdubrovskiy/listify/models"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type mockCollection struct {
	findFunc      func(context.Context, interface{}) (database.Cursor, error)
	insertOneFunc func(context.Context, interface{}) (interface{}, error)
	updateOneFunc func(context.Context, interface{}, interface{}) (interface{}, error)
	deleteOneFunc func(context.Context, interface{}) (interface{}, error)
}

func (m *mockCollection) Find(ctx context.Context, filter interface{}) (database.Cursor, error) {
	return m.findFunc(ctx, filter)
}

func (m *mockCollection) InsertOne(ctx context.Context, doc interface{}) (interface{}, error) {
	return m.insertOneFunc(ctx, doc)
}

func (m *mockCollection) UpdateOne(ctx context.Context, filter interface{}, update interface{}) (interface{}, error) {
	return m.updateOneFunc(ctx, filter, update)
}

func (m *mockCollection) DeleteOne(ctx context.Context, filter interface{}) (interface{}, error) {
	return m.deleteOneFunc(ctx, filter)
}

type mockCursor struct {
	todos []models.Todo
	err   error
}

func (m *mockCursor) Close(context.Context) error {
	return nil
}

func (m *mockCursor) All(ctx context.Context, result interface{}) error {
	if m.err != nil {
		return m.err
	}
	todos := result.(*[]models.Todo)
	*todos = m.todos
	return nil
}

func setupTestApp(mc database.Collection) *fiber.App {
	app := fiber.New()
	database.TodoCollection = mc
	handler := NewTodoHandler()

	v1 := app.Group("/api/v1")
	v1.Get("/todos", handler.GetTodos)
	v1.Post("/todos", handler.CreateTodo)
	v1.Put("/todos/:id/complete", handler.CompleteTodo)
	v1.Delete("/todos/:id", handler.DeleteTodo)

	return app
}

func TestGetTodos(t *testing.T) {
	tests := []struct {
		name           string
		mockData       []models.Todo
		mockError      error
		cursorError    error
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success - Empty todos list",
			mockData:       []models.Todo{},
			expectedStatus: 200,
			expectedBody:   "[]",
		},
		{
			name: "Success - With todos",
			mockData: []models.Todo{
				{
					ID:        primitive.NewObjectID(),
					Body:      "Test todo",
					Completed: false,
				},
			},
			expectedStatus: 200,
		},
		{
			name:           "Database Find Error",
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error fetching todos"}`,
		},
		{
			name:           "Cursor All Error",
			cursorError:    errors.New("cursor error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error parsing todos"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				findFunc: func(ctx context.Context, filter interface{}) (database.Cursor, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					return &mockCursor{todos: tt.mockData, err: tt.cursorError}, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("GET", "/api/v1/todos", nil)
			resp, err := app.Test(req)

			assert.NoError(t, err)
			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			if tt.expectedBody != "" {
				var body []byte
				body, err = io.ReadAll(resp.Body)
				assert.NoError(t, err)
				assert.JSONEq(t, tt.expectedBody, string(body))
			}
		})
	}
}

func TestCreateTodo(t *testing.T) {
	tests := []struct {
		name           string
		input          string
		mockID         primitive.ObjectID
		mockError      error
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success",
			input:          `{"body":"Test todo"}`,
			mockID:         primitive.NewObjectID(),
			expectedStatus: 201,
		},
		{
			name:           "Invalid request body",
			input:          `invalid json`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid request body"}`,
		},
		{
			name:           "Empty todo body",
			input:          `{"body":""}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Todo body is required"}`,
		},
		{
			name:           "Database Error",
			input:          `{"body":"Test todo"}`,
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error creating todo"}`,
		},
		{
			name:           "Invalid ID Type",
			input:          `{"body":"Test todo"}`,
			mockID:         primitive.NilObjectID,
			expectedStatus: 201,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				insertOneFunc: func(ctx context.Context, doc interface{}) (interface{}, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					return tt.mockID, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("POST", "/api/v1/todos", bytes.NewBufferString(tt.input))
			req.Header.Set("Content-Type", "application/json")
			resp, err := app.Test(req)

			assert.NoError(t, err)
			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			if tt.expectedBody != "" {
				var body []byte
				body, err = io.ReadAll(resp.Body)
				assert.NoError(t, err)
				assert.JSONEq(t, tt.expectedBody, string(body))
			}
		})
	}
}

func TestCompleteTodo(t *testing.T) {
	validID := primitive.NewObjectID()
	tests := []struct {
		name           string
		todoID         string
		mockError      error
		mockResult     interface{}
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success",
			todoID:         validID.Hex(),
			mockResult:     struct{ MatchedCount int64 }{1},
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo marked as completed"}`,
		},
		{
			name:           "Invalid ID format",
			todoID:         "invalid",
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid ID format"}`,
		},
		{
			name:           "Todo not found",
			todoID:         primitive.NewObjectID().Hex(),
			mockError:      mongo.ErrNoDocuments,
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Database Error",
			todoID:         validID.Hex(),
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error updating todo"}`,
		},
		{
			name:           "No Match Found",
			todoID:         validID.Hex(),
			mockResult:     struct{ MatchedCount int64 }{0},
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Invalid Result Type",
			todoID:         validID.Hex(),
			mockResult:     "invalid",
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo marked as completed"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				updateOneFunc: func(ctx context.Context, filter interface{}, update interface{}) (interface{}, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					return tt.mockResult, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("PUT", "/api/v1/todos/"+tt.todoID+"/complete", nil)
			resp, err := app.Test(req)

			assert.NoError(t, err)
			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			if tt.expectedBody != "" {
				var body []byte
				body, err = io.ReadAll(resp.Body)
				assert.NoError(t, err)
				assert.JSONEq(t, tt.expectedBody, string(body))
			}
		})
	}
}

func TestDeleteTodo(t *testing.T) {
	validID := primitive.NewObjectID()
	tests := []struct {
		name           string
		todoID         string
		mockError      error
		mockResult     interface{}
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success",
			todoID:         validID.Hex(),
			mockResult:     struct{ DeletedCount int64 }{1},
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo deleted"}`,
		},
		{
			name:           "Invalid ID format",
			todoID:         "invalid",
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid ID format"}`,
		},
		{
			name:           "Todo not found",
			todoID:         primitive.NewObjectID().Hex(),
			mockError:      mongo.ErrNoDocuments,
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Database Error",
			todoID:         validID.Hex(),
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error deleting todo"}`,
		},
		{
			name:           "No Match Found",
			todoID:         validID.Hex(),
			mockResult:     struct{ DeletedCount int64 }{0},
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Invalid Result Type",
			todoID:         validID.Hex(),
			mockResult:     "invalid",
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo deleted"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				deleteOneFunc: func(ctx context.Context, filter interface{}) (interface{}, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					return tt.mockResult, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("DELETE", "/api/v1/todos/"+tt.todoID, nil)
			resp, err := app.Test(req)

			assert.NoError(t, err)
			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			if tt.expectedBody != "" {
				var body []byte
				body, err = io.ReadAll(resp.Body)
				assert.NoError(t, err)
				assert.JSONEq(t, tt.expectedBody, string(body))
			}
		})
	}
}
