package models

import (
	"time"
)

// Employee represents the employee table
type Employee struct {
	ID            int       `json:"id" db:"id"`
	EmployeeID    string    `json:"employee_id" db:"employee_id" binding:"required"`
	DepartementID int       `json:"departement_id" db:"departement_id" binding:"required"`
	Name          string    `json:"name" db:"name" binding:"required"`
	Address       string    `json:"address" db:"address"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

// EmployeeWithDepartment represents employee with department information
type EmployeeWithDepartment struct {
	ID            int       `json:"id" db:"id"`
	EmployeeID    string    `json:"employee_id" db:"employee_id"`
	DepartementID int       `json:"departement_id" db:"departement_id"`
	Name          string    `json:"name" db:"name"`
	Address       string    `json:"address" db:"address"`
	Department    Department `json:"department"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

// CreateEmployeeRequest represents the request body for creating an employee
type CreateEmployeeRequest struct {
	EmployeeID    string `json:"employee_id" binding:"required"`
	DepartementID int    `json:"departement_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Address       string `json:"address"`
}

// UpdateEmployeeRequest represents the request body for updating an employee
type UpdateEmployeeRequest struct {
	DepartementID int    `json:"departement_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Address       string `json:"address"`
}
