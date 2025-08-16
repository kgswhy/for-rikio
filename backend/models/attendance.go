package models

import (
	"time"
)

// Attendance represents the attendance table
type Attendance struct {
	ID           int       `json:"id" db:"id"`
	EmployeeID   string    `json:"employee_id" db:"employee_id"`
	AttendanceID string    `json:"attendance_id" db:"attendance_id"`
	ClockIn      time.Time `json:"clock_in" db:"clock_in"`
	ClockOut     *time.Time `json:"clock_out" db:"clock_out"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// AttendanceHistory represents the attendance_history table
type AttendanceHistory struct {
	ID              int       `json:"id" db:"id"`
	EmployeeID      string    `json:"employee_id" db:"employee_id"`
	AttendanceID    string    `json:"attendance_id" db:"attendance_id"`
	DateAttendance  time.Time `json:"date_attendance" db:"date_attendance"`
	AttendanceType  int       `json:"attendance_type" db:"attendance_type"` // 1 = In, 2 = Out
	Description     string    `json:"description" db:"description"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// ClockInRequest represents the request body for clock in
type ClockInRequest struct {
	EmployeeID string `json:"employee_id" binding:"required"`
}

// ClockOutRequest represents the request body for clock out
type ClockOutRequest struct {
	EmployeeID string `json:"employee_id" binding:"required"`
}

// AttendanceLog represents attendance log with employee and department info
type AttendanceLog struct {
	ID              int       `json:"id" db:"id"`
	EmployeeID      string    `json:"employee_id" db:"employee_id"`
	EmployeeName    string    `json:"employee_name" db:"employee_name"`
	DepartmentID    int       `json:"department_id" db:"department_id"`
	DepartmentName  string    `json:"department_name" db:"department_name"`
	AttendanceID    string    `json:"attendance_id" db:"attendance_id"`
	DateAttendance  time.Time `json:"date_attendance" db:"date_attendance"`
	AttendanceType  int       `json:"attendance_type" db:"attendance_type"`
	Description     string    `json:"description" db:"description"`
	MaxClockInTime  string    `json:"max_clock_in_time" db:"max_clock_in_time"`
	MaxClockOutTime string    `json:"max_clock_out_time" db:"max_clock_out_time"`
	IsOnTime        bool      `json:"is_on_time" db:"is_on_time"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}

// AttendanceFilter represents filter parameters for attendance logs
type AttendanceFilter struct {
	Date         string `form:"date"`
	DepartmentID int    `form:"department_id"`
}
