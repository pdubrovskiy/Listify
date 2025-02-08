package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/pdubrovskiy/listify/routes"
)

func main() {
	app := fiber.New()

	routes.SetupTodoRoutes(app)

	log.Fatal(app.Listen(":4000"))
}
