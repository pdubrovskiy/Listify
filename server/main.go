package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/pdubrovskiy/listify/database"
	"github.com/pdubrovskiy/listify/routes"
)

func main() {
	app := fiber.New()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	PORT := os.Getenv("PORT")

	database.ConnectMongoDB()
	routes.SetupTodoRoutes(app)

	log.Fatal(app.Listen("0.0.0.0:" + PORT))
}
