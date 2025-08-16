package models

// Department represents the departement table
type Department struct {
	ID               int       `json:"id" db:"id"`
	DepartementName  string    `json:"departement_name" db:"departement_name" binding:"required"`
	MaxClockInTime   string    `json:"max_clock_in_time" db:"max_clock_in_time" binding:"required"`
	MaxClockOutTime  string    `json:"max_clock_out_time" db:"max_clock_out_time" binding:"required"`
}

// CreateDepartmentRequest represents the request body for creating a department
type CreateDepartmentRequest struct {
	DepartementName string `json:"departement_name" binding:"required"`
	MaxClockInTime  string `json:"max_clock_in_time" binding:"required"`
	MaxClockOutTime string `json:"max_clock_out_time" binding:"required"`
}

// UpdateDepartmentRequest represents the request body for updating a department
type UpdateDepartmentRequest struct {
	DepartementName string `json:"departement_name" binding:"required"`
	MaxClockInTime  string `json:"max_clock_in_time" binding:"required"`
	MaxClockOutTime string `json:"max_clock_out_time" binding:"required"`
}
