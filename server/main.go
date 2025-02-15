package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/pdubrovskiy/listify/database"
	"github.com/pdubrovskiy/listify/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found. Using environment variables.")
	}

	database.ConnectDB()
	defer database.DisconnectDB()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	routes.SetupRoutes(app)

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
		log.Println("PORT not set. Defaulting to 8080")
	}

	log.Fatal(app.Listen(":" + PORT))
}
