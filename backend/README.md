# Attendance Management System

A full-stack attendance management system built with Go (Gin framework) and MySQL, designed for multinational companies with 50+ employees to systematically record and evaluate employee discipline.

## Features

- **Employee Management**: Complete CRUD operations for employees
- **Department Management**: Complete CRUD operations for departments with configurable clock-in/out times
- **Attendance Tracking**: Clock in/out functionality with automatic punctuality evaluation
- **Attendance Logs**: Detailed attendance history with filtering capabilities
- **Punctuality Evaluation**: Automatic evaluation based on department-specific time limits

## Technology Stack

- **Backend**: Go 1.21+ with Gin framework
- **Database**: MySQL 8.0+
- **Architecture**: RESTful API with MVC pattern

## Project Structure

```
attendance-system/
├── main.go                 # Application entry point
├── go.mod                  # Go module file
├── config/
│   └── database.go         # Database configuration
├── models/
│   ├── employee.go         # Employee data models
│   ├── department.go       # Department data models
│   └── attendance.go       # Attendance data models
├── handlers/
│   ├── employee.go         # Employee CRUD handlers
│   ├── department.go       # Department CRUD handlers
│   └── attendance.go       # Attendance handlers
├── routes/
│   └── routes.go           # API route definitions
├── database/
│   └── schema.sql          # Database schema and sample data
├── env.example             # Environment variables template
└── README.md               # Project documentation
```

## Database Schema

The system uses 4 main tables based on the provided ERD:

1. **departement**: Stores department information with max clock-in/out times
2. **employee**: Stores employee information linked to departments
3. **attendance**: Records daily clock-in/out times
4. **attendance_history**: Detailed log of all attendance events

## Installation & Setup

### Prerequisites

- Go 1.21 or higher
- MySQL 8.0 or higher
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd attendance-system
```

### 2. Install Dependencies

```bash
go mod tidy
```

### 3. Database Setup

1. Create a MySQL database
2. Import the schema:
```bash
mysql -u root -p < database/schema.sql
```

### 4. Environment Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=attendance_system
PORT=8080
```

### 5. Run the Application

```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/employees/` | Create a new employee |
| GET | `/api/v1/employees/` | Get all employees |
| GET | `/api/v1/employees/:id` | Get employee by ID |
| PUT | `/api/v1/employees/:id` | Update employee |
| DELETE | `/api/v1/employees/:id` | Delete employee |

### Department Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/departments/` | Create a new department |
| GET | `/api/v1/departments/` | Get all departments |
| GET | `/api/v1/departments/:id` | Get department by ID |
| PUT | `/api/v1/departments/:id` | Update department |
| DELETE | `/api/v1/departments/:id` | Delete department |

### Attendance Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/attendance/clock-in` | Employee clock in |
| PUT | `/api/v1/attendance/clock-out` | Employee clock out |
| GET | `/api/v1/attendance/logs` | Get attendance logs with filters |

## API Usage Examples

### Create Employee

```bash
curl -X POST http://localhost:8080/api/v1/employees/ \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP006",
    "departement_id": 1,
    "name": "Sarah Wilson",
    "address": "789 Oak Street, City"
  }'
```

### Create Department

```bash
curl -X POST http://localhost:8080/api/v1/departments/ \
  -H "Content-Type: application/json" \
  -d '{
    "departement_name": "Sales Department",
    "max_clock_in_time": "08:45:00",
    "max_clock_out_time": "17:45:00"
  }'
```

### Clock In

```bash
curl -X POST http://localhost:8080/api/v1/attendance/clock-in \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001"
  }'
```

### Clock Out

```bash
curl -X PUT http://localhost:8080/api/v1/attendance/clock-out \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001"
  }'
```

### Get Attendance Logs

```bash
# Get all logs
curl http://localhost:8080/api/v1/attendance/logs

# Filter by date
curl "http://localhost:8080/api/v1/attendance/logs?date=2024-01-15"

# Filter by department
curl "http://localhost:8080/api/v1/attendance/logs?department_id=1"

# Filter by both date and department
curl "http://localhost:8080/api/v1/attendance/logs?date=2024-01-15&department_id=1"
```

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "count": 1
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

## Punctuality Evaluation

The system automatically evaluates employee punctuality based on:

1. **Clock In**: Employee must clock in before or at the department's `max_clock_in_time`
2. **Clock Out**: Employee must clock out after or at the department's `max_clock_out_time`

The evaluation is stored in the attendance history with appropriate descriptions:
- "Clock In" / "Clock In (Late)"
- "Clock Out" / "Clock Out (Early)"

## Business Rules

1. **Employee ID**: Must be unique across the system
2. **Department Constraints**: Cannot delete departments with active employees
3. **Employee Constraints**: Cannot delete employees with attendance records
4. **Attendance Rules**:
   - One clock-in per day per employee
   - Must clock in before clocking out
   - Cannot clock out multiple times per day
5. **Time Validation**: Uses department-specific time limits for punctuality evaluation

## Development

### Running Tests

```bash
go test ./...
```

### Building for Production

```bash
go build -o attendance-system main.go
```

### Docker Support

```bash
# Build Docker image
docker build -t attendance-system .

# Run with Docker
docker run -p 8080:8080 attendance-system
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
