# Project Rikio - Employee Management System

A full-stack employee management system built with Go (backend) and Next.js (frontend).

## 🏗️ Project Structure

```
Project-rikio/
├── backend/          # Go backend API
├── frontend/         # Next.js frontend application
├── docs/            # API documentation
├── run-all.sh       # Script to run both backend and frontend
├── run-backend.sh   # Script to run backend only
└── run-frontend.sh  # Script to run frontend only
```

## 🚀 Quick Start

### Prerequisites

- Go 1.21+ 
- Node.js 18+
- Docker (optional, for database)
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Project-rikio
   ```

2. **Setup Backend**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database configuration
   go mod download
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**

   **Option 1: Run everything at once**
   ```bash
   ./run-all.sh
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   ./run-backend.sh
   
   # Terminal 2 - Frontend
   ./run-frontend.sh
   ```

## 🛠️ Technology Stack

### Backend (Go)
- **Framework**: Standard Go HTTP server
- **Database**: PostgreSQL (with Docker support)
- **ORM**: Custom database layer
- **API**: RESTful API
- **Features**: 
  - Employee management
  - Department management
  - Attendance tracking
  - CSV export functionality

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Features**:
  - Employee CRUD operations
  - Department management
  - Attendance tracking
  - Responsive design

## 📁 Directory Structure

### Backend Structure
```
backend/
├── config/          # Configuration files
├── database/        # Database schema and migrations
├── handlers/        # HTTP request handlers
├── models/          # Data models
├── routes/          # API route definitions
├── services/        # Business logic services
├── main.go          # Application entry point
└── Dockerfile       # Docker configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # Reusable UI components
│   ├── lib/         # Utility functions and API client
│   └── types/       # TypeScript type definitions
├── public/          # Static assets
└── package.json     # Dependencies and scripts
```

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=rikio_db
SERVER_PORT=8080
```

### Frontend Configuration
The frontend is configured to connect to the backend API running on `http://localhost:8080`.

## 📚 API Documentation

API documentation is available in the `docs/` directory. See `docs/API.md` for detailed endpoint documentation.

### Main Endpoints
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/departments` - List all departments
- `GET /api/attendance` - Get attendance records

## 🐳 Docker Support

### Running with Docker Compose
```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend API server

## 🧪 Development

### Backend Development
```bash
cd backend
go run main.go
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Running Tests
```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
cd frontend
npm test
```

## 📦 Build for Production

### Backend
```bash
cd backend
go build -o main .
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation in the `docs/` directory
2. Review existing issues in the repository
3. Create a new issue with detailed information about your problem

## 🔄 Updates

Stay updated with the latest changes by:
- Watching the repository
- Checking the releases page
- Following the commit history

---

**Happy Coding! 🚀**
