# 📊 Attendance Management System

A modern full-stack attendance management system built with **Go (Gin)** backend and **Next.js** frontend.

## 🚀 Features

### Core Features
- ✅ **Employee Management** - Add, edit, delete employees with department assignment
- ✅ **Department Management** - Configure departments with custom clock-in/out policies
- ✅ **Attendance Tracking** - Clock in/out functionality with time validation
- ✅ **Real-time Dashboard** - View attendance logs with filtering and search
- ✅ **CSV Export** - Export attendance data for reporting
- ✅ **Responsive UI** - Modern interface built with Tailwind CSS

### Technical Features
- 🔐 **Type Safety** - Full TypeScript implementation
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean interface with Heroicons
- ⚡ **Fast Performance** - Optimized with Next.js and Go
- 🗄️ **Database** - MySQL with proper schema design

## 🏗️ Architecture

```
Project-ryo/
├── backend/          # Go (Gin) API Server
│   ├── config/       # Database configuration
│   ├── handlers/     # HTTP request handlers
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   └── services/     # Business logic
└── frontend/         # Next.js React App
    ├── src/
    │   ├── app/      # Pages and routing
    │   ├── components/ # Reusable components
    │   ├── lib/      # API utilities
    │   └── types/    # TypeScript definitions
```

## 🛠️ Tech Stack

### Backend
- **Go 1.21+** - Programming language
- **Gin** - Web framework
- **MySQL** - Database
- **GORM** - ORM (if used)
- **CORS** - Cross-origin support

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Axios** - HTTP client

## 📋 Prerequisites

- **Go 1.21+** installed
- **Node.js 18+** installed
- **MySQL** database server
- **Git** for version control

## 🚀 Quick Start

### Option 1: Run Everything (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd Project-ryo

# Make scripts executable
chmod +x run-*.sh

# Start both frontend and backend
./run-all.sh
```

### Option 2: Run Individually
```bash
# Start backend only
./run-backend.sh

# Start frontend only (in another terminal)
./run-frontend.sh
```

## ⚙️ Configuration

### Backend Configuration
1. Copy environment file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Configure database settings in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=attendance_system
   PORT=8080
   ```

3. Create MySQL database:
   ```sql
   CREATE DATABASE attendance_system;
   ```

### Frontend Configuration
The frontend automatically connects to `http://localhost:8080` for the API.

## 📱 Usage

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

### Main Features

#### 1. Employee Management
- Navigate to `/employees`
- Add new employees with department assignment
- Edit employee information
- Delete employees

#### 2. Department Management
- Navigate to `/departments`
- Create departments with custom policies
- Set max clock-in/out times
- Edit department settings

#### 3. Attendance Tracking
- Navigate to `/attendance`
- Clock in/out for employees
- View attendance logs
- Filter by date, employee, or department
- Export attendance data

## 🔧 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `GET /api/attendance/logs` - Get attendance logs
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out

### Export
- `GET /api/export/employees` - Export employees CSV
- `GET /api/export/departments` - Export departments CSV
- `GET /api/export/attendance` - Export attendance CSV

## 🗄️ Database Schema

### Employees Table
```sql
- id (Primary Key)
- employee_id (Unique)
- departement_id (Foreign Key)
- name
- address
- created_at
- updated_at
```

### Departments Table
```sql
- id (Primary Key)
- departement_name
- max_clock_in_time
- max_clock_out_time
- created_at
- updated_at
```

### Attendance Logs Table
```sql
- id (Primary Key)
- employee_id (Foreign Key)
- attendance_type (1=Clock In, 2=Clock Out)
- date_attendance
- is_on_time
- created_at
```

## 🧪 Development

### Backend Development
```bash
cd backend
go mod tidy
go run main.go
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Backend formatting
cd backend
go fmt ./...
```

## 📦 Deployment

### Backend Deployment
1. Build the Go binary:
   ```bash
   cd backend
   go build -o attendance-system main.go
   ```

2. Set production environment variables
3. Run the binary

### Frontend Deployment
1. Build the Next.js app:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Go and Next.js**
