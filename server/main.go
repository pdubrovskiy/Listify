package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/pdubrovskiy/listify/database"
	"github.com/pdubrovskiy/listify/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	database.ConnectDB()
	defer database.DisconnectDB()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
