# 🔧 API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
Currently, the API doesn't require authentication. All endpoints are publicly accessible.

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 📋 Employees API

### Get All Employees
```http
GET /api/employees
```

**Response:**
```json
{
  "success": true,
  "employees": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "departement_id": 1,
      "name": "John Doe",
      "address": "123 Main St",
      "department": {
        "id": 1,
        "departement_name": "Engineering",
        "max_clock_in_time": "08:30:00",
        "max_clock_out_time": "17:30:00"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Employee
```http
POST /api/employees
```

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "departement_id": 1,
  "name": "Jane Smith",
  "address": "456 Oak Ave"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "employee": {
    "id": 2,
    "employee_id": "EMP002",
    "departement_id": 1,
    "name": "Jane Smith",
    "address": "456 Oak Ave",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Employee
```http
PUT /api/employees/{id}
```

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "departement_id": 2,
  "name": "Jane Smith Updated",
  "address": "789 Pine St"
}
```

### Delete Employee
```http
DELETE /api/employees/{id}
```

---

## 🏢 Departments API

### Get All Departments
```http
GET /api/departments
```

**Response:**
```json
{
  "success": true,
  "departments": [
    {
      "id": 1,
      "departement_name": "Engineering",
      "max_clock_in_time": "08:30:00",
      "max_clock_out_time": "17:30:00",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Department
```http
POST /api/departments
```

**Request Body:**
```json
{
  "departement_name": "Marketing",
  "max_clock_in_time": "09:00:00",
  "max_clock_out_time": "18:00:00"
}
```

### Update Department
```http
PUT /api/departments/{id}
```

### Delete Department
```http
DELETE /api/departments/{id}
```

---

## ⏰ Attendance API

### Get Attendance Logs
```http
GET /api/attendance/logs
```

**Query Parameters:**
- `employee_id` (optional) - Filter by employee ID
- `department_id` (optional) - Filter by department ID
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `attendance_type` (optional) - Filter by type (1=Clock In, 2=Clock Out)

**Response:**
```json
{
  "success": true,
  "attendance_logs": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "employee_name": "John Doe",
      "department_name": "Engineering",
      "attendance_type": 1,
      "date_attendance": "2024-01-01T08:30:00Z",
      "is_on_time": true,
      "created_at": "2024-01-01T08:30:00Z"
    }
  ]
}
```

### Clock In
```http
POST /api/attendance/clock-in
```

**Request Body:**
```json
{
  "employee_id": "EMP001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Clock in successful",
  "attendance": {
    "id": 1,
    "employee_id": "EMP001",
    "attendance_type": 1,
    "date_attendance": "2024-01-01T08:30:00Z",
    "is_on_time": true,
    "created_at": "2024-01-01T08:30:00Z"
  }
}
```

### Clock Out
```http
POST /api/attendance/clock-out
```

**Request Body:**
```json
{
  "employee_id": "EMP001"
}
```

---

## 📊 Export API

### Export Employees CSV
```http
GET /api/export/employees
```

**Response:** CSV file download

### Export Departments CSV
```http
GET /api/export/departments
```

**Response:** CSV file download

### Export Attendance CSV
```http
GET /api/export/attendance
```

**Query Parameters:**
- `employee_id` (optional) - Filter by employee ID
- `department_id` (optional) - Filter by department ID
- `date` (optional) - Filter by date (YYYY-MM-DD)

**Response:** CSV file download

---

## 🔍 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Time validation is based on department settings
- Employee IDs must be unique
- Department names must be unique
- Attendance logs are immutable once created
