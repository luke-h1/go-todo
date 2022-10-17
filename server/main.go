package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID    int    `json:"id"`
	Title string `title:"id"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

func main() {
	fmt.Println("Hello world")

	app := fiber.New(fiber.Config{})

	todos := []Todo{}

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})

	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil {
			return err
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}
