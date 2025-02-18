package handlers

import (
	"bytes"
	"context"
	"encoding/json"
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
	todos    []models.Todo
	err      error
	closeErr error
}

func (m *mockCursor) Close(context.Context) error {
	return m.closeErr
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
	v1.Put("/todos/:id/complete", handler.UpdateTodo)
	v1.Delete("/todos/:id", handler.DeleteTodo)

	return app
}

func TestGetTodos(t *testing.T) {
	tests := []struct {
		name           string
		queryParams    string
		mockData       []models.Todo
		mockError      error
		cursorError    error
		closeError     error
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
					Date:      "2024-03-20",
				},
			},
			expectedStatus: 200,
		},
		{
			name:        "Success - Filter by date",
			queryParams: "?date=2024-03-20",
			mockData: []models.Todo{
				{
					ID:        primitive.NewObjectID(),
					Body:      "Test todo",
					Completed: false,
					Date:      "2024-03-20",
				},
			},
			expectedStatus: 200,
		},
		{
			name:        "Success - Filter by date range",
			queryParams: "?start=2024-03-20&end=2024-03-21",
			mockData: []models.Todo{
				{
					ID:        primitive.NewObjectID(),
					Body:      "Test todo 1",
					Completed: false,
					Date:      "2024-03-20",
				},
				{
					ID:        primitive.NewObjectID(),
					Body:      "Test todo 2",
					Completed: false,
					Date:      "2024-03-21",
				},
			},
			expectedStatus: 200,
		},
		{
			name:           "Success - Start date without end date",
			queryParams:    "?start=2024-03-20",
			mockData:       []models.Todo{},
			expectedStatus: 200,
			expectedBody:   "[]",
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
		{
			name:           "Cursor Close Error",
			closeError:     errors.New("close error"),
			expectedStatus: 200,
			expectedBody:   "[]",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				findFunc: func(ctx context.Context, filter interface{}) (database.Cursor, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					return &mockCursor{todos: tt.mockData, err: tt.cursorError, closeErr: tt.closeError}, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("GET", "/api/v1/todos"+tt.queryParams, nil)
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
	validID := primitive.NewObjectID()
	tests := []struct {
		name           string
		input          string
		mockID         primitive.ObjectID
		mockError      error
		mockNilResult  bool
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success",
			input:          `{"body":"Test todo","date":"2024-03-20"}`,
			mockID:         validID,
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
			input:          `{"body":"","date":"2024-03-20"}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Todo body is required"}`,
		},
		{
			name:           "Missing todo body",
			input:          `{"date":"2024-03-20"}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Todo body is required"}`,
		},
		{
			name:           "Missing date",
			input:          `{"body":"Test todo"}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Todo date is required"}`,
		},
		{
			name:           "Empty date",
			input:          `{"body":"Test todo","date":""}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Todo date is required"}`,
		},
		{
			name:           "Invalid date format",
			input:          `{"body":"Test todo","date":"20-03-2024"}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid date format. Use YYYY-MM-DD"}`,
		},
		{
			name:           "Database Error",
			input:          `{"body":"Test todo","date":"2024-03-20"}`,
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error creating todo"}`,
		},
		{
			name:           "Nil Result",
			input:          `{"body":"Test todo","date":"2024-03-20"}`,
			mockNilResult:  true,
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
					if tt.mockNilResult {
						return nil, nil
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
			} else if tt.expectedStatus == 201 {
				var body []byte
				body, err = io.ReadAll(resp.Body)
				assert.NoError(t, err)

				var todo models.Todo
				err = json.Unmarshal(body, &todo)
				assert.NoError(t, err)

				assert.NotEmpty(t, todo.CreatedAt)
				assert.NotEmpty(t, todo.UpdatedAt)
				assert.Equal(t, todo.CreatedAt, todo.UpdatedAt)
			}
		})
	}
}

func TestCompleteTodo(t *testing.T) {
	validID := primitive.NewObjectID()

	tests := []struct {
		name           string
		todoID         string
		requestBody    string
		mockError      error
		mockResult     *mongo.UpdateResult
		mockNilResult  bool
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success - Set completed to true",
			todoID:         validID.Hex(),
			requestBody:    `{"completed":true}`,
			mockResult:     &mongo.UpdateResult{MatchedCount: 1, ModifiedCount: 1},
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo status updated successfully"}`,
		},
		{
			name:           "Success - Set completed to false",
			todoID:         validID.Hex(),
			requestBody:    `{"completed":false}`,
			mockResult:     &mongo.UpdateResult{MatchedCount: 1, ModifiedCount: 1},
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo status updated successfully"}`,
		},
		{
			name:           "Invalid request body",
			todoID:         validID.Hex(),
			requestBody:    `invalid json`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid request body"}`,
		},
		{
			name:           "Missing request body",
			todoID:         validID.Hex(),
			requestBody:    `{}`,
			mockResult:     &mongo.UpdateResult{MatchedCount: 1, ModifiedCount: 1},
			expectedStatus: 200,
			expectedBody:   `{"message":"Todo status updated successfully"}`,
		},
		{
			name:           "Invalid ID format",
			todoID:         "invalid",
			requestBody:    `{"completed":true}`,
			expectedStatus: 400,
			expectedBody:   `{"error":"Invalid ID format"}`,
		},
		{
			name:           "Todo not found",
			todoID:         primitive.NewObjectID().Hex(),
			requestBody:    `{"completed":true}`,
			mockError:      mongo.ErrNoDocuments,
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Database Error",
			todoID:         validID.Hex(),
			requestBody:    `{"completed":true}`,
			mockError:      errors.New("database error"),
			expectedStatus: 500,
			expectedBody:   `{"error":"Error updating todo"}`,
		},
		{
			name:           "No Match Found",
			todoID:         validID.Hex(),
			requestBody:    `{"completed":true}`,
			mockResult:     &mongo.UpdateResult{MatchedCount: 0, ModifiedCount: 0},
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Nil Result",
			todoID:         validID.Hex(),
			requestBody:    `{"completed":true}`,
			mockNilResult:  true,
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				updateOneFunc: func(ctx context.Context, filter interface{}, update interface{}) (interface{}, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					if tt.mockNilResult {
						return nil, nil
					}
					return tt.mockResult, nil
				},
			}

			app := setupTestApp(mc)
			req := httptest.NewRequest("PUT", "/api/v1/todos/"+tt.todoID+"/complete", bytes.NewBufferString(tt.requestBody))
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

func TestDeleteTodo(t *testing.T) {
	validID := primitive.NewObjectID()
	tests := []struct {
		name           string
		todoID         string
		mockError      error
		mockResult     *mongo.DeleteResult
		mockNilResult  bool
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Success",
			todoID:         validID.Hex(),
			mockResult:     &mongo.DeleteResult{DeletedCount: 1},
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
			mockResult:     &mongo.DeleteResult{DeletedCount: 0},
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
		{
			name:           "Nil Result",
			todoID:         validID.Hex(),
			mockNilResult:  true,
			expectedStatus: 404,
			expectedBody:   `{"error":"Todo not found"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mc := &mockCollection{
				deleteOneFunc: func(ctx context.Context, filter interface{}) (interface{}, error) {
					if tt.mockError != nil {
						return nil, tt.mockError
					}
					if tt.mockNilResult {
						return nil, nil
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

func TestNewTodoHandler(t *testing.T) {
	handler := NewTodoHandler()
	assert.NotNil(t, handler)
	assert.IsType(t, &TodoHandler{}, handler)
}
