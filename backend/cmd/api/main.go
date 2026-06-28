package main

import (
	"log"
	"os"

	"atp-utility-backend/internal/db"
	pdfhandler "atp-utility-backend/internal/modules/pdf/handler"
	pdfusecase "atp-utility-backend/internal/modules/pdf/usecase"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// 2. Initialize Database connection
	db.InitPostgres()

	// 3. Setup Gin Router
	router := gin.Default()

	// Enable CORS for Next.js frontend
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // For development
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 4. Register Routes
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong", "status": "healthy"})
	})

	// Setup PDF Module
	pdfUC := pdfusecase.NewPdfUsecase()
	pdfhandler.NewPdfHandler(router, pdfUC)

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting backend server on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
