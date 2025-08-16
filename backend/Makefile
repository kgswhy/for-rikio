.PHONY: build run test clean docker-build docker-run docker-compose-up docker-compose-down

# Build the application
build:
	go build -o attendance-system main.go

# Run the application
run:
	go run main.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -f attendance-system
	go clean

# Install dependencies
deps:
	go mod tidy
	go mod download

# Build Docker image
docker-build:
	docker build -t attendance-system .

# Run with Docker
docker-run:
	docker run -p 8080:8080 --env-file .env attendance-system

# Start with Docker Compose
docker-compose-up:
	docker-compose up -d

# Stop Docker Compose
docker-compose-down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Database setup
db-setup:
	mysql -u root -p < database/schema.sql

# Development setup
dev-setup: deps
	cp env.example .env
	@echo "Please update .env file with your database credentials"

# Help
help:
	@echo "Available commands:"
	@echo "  build           - Build the application"
	@echo "  run             - Run the application"
	@echo "  test            - Run tests"
	@echo "  clean           - Clean build artifacts"
	@echo "  deps            - Install dependencies"
	@echo "  docker-build    - Build Docker image"
	@echo "  docker-run      - Run with Docker"
	@echo "  docker-compose-up   - Start with Docker Compose"
	@echo "  docker-compose-down - Stop Docker Compose"
	@echo "  logs            - View logs"
	@echo "  db-setup        - Setup database"
	@echo "  dev-setup       - Development setup"
	@echo "  help            - Show this help"
