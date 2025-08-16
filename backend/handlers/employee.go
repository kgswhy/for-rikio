package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"attendance-system/models"
	"attendance-system/services"

	"github.com/gin-gonic/gin"
)

// EmployeeHandler handles employee-related HTTP requests
type EmployeeHandler struct {
	db *sql.DB
}

// NewEmployeeHandler creates a new employee handler
func NewEmployeeHandler(db *sql.DB) *EmployeeHandler {
	return &EmployeeHandler{db: db}
}

// CreateEmployee creates a new employee
func (h *EmployeeHandler) CreateEmployee(c *gin.Context) {
	var req models.CreateEmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if employee_id already exists
	var exists int
	err := h.db.QueryRow("SELECT 1 FROM employee WHERE employee_id = ?", req.EmployeeID).Scan(&exists)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Employee ID already exists"})
		return
	}

	// Check if department exists
	var deptExists int
	err = h.db.QueryRow("SELECT 1 FROM departement WHERE id = ?", req.DepartementID).Scan(&deptExists)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Department not found"})
		return
	}

	now := time.Now()
	result, err := h.db.Exec(`
		INSERT INTO employee (employee_id, departement_id, name, address, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`, req.EmployeeID, req.DepartementID, req.Name, req.Address, now, now)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee"})
		return
	}

	id, _ := result.LastInsertId()
	employee := models.Employee{
		ID:            int(id),
		EmployeeID:    req.EmployeeID,
		DepartementID: req.DepartementID,
		Name:          req.Name,
		Address:       req.Address,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Employee created successfully",
		"employee": employee,
	})
}

// GetEmployees retrieves all employees with optional department info
func (h *EmployeeHandler) GetEmployees(c *gin.Context) {
	query := `
		SELECT e.id, e.employee_id, e.departement_id, e.name, e.address, 
		       e.created_at, e.updated_at,
		       d.id, d.departement_name, d.max_clock_in_time, d.max_clock_out_time
		FROM employee e
		LEFT JOIN departement d ON e.departement_id = d.id
		ORDER BY e.created_at DESC
	`

	rows, err := h.db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}
	defer rows.Close()

	var employees []models.EmployeeWithDepartment
	for rows.Next() {
		var emp models.EmployeeWithDepartment
		var dept models.Department
		err := rows.Scan(
			&emp.ID, &emp.EmployeeID, &emp.DepartementID, &emp.Name, &emp.Address,
			&emp.CreatedAt, &emp.UpdatedAt,
			&dept.ID, &dept.DepartementName, &dept.MaxClockInTime, &dept.MaxClockOutTime,
		)
		if err != nil {
			continue
		}
		emp.Department = dept
		employees = append(employees, emp)
	}

	c.JSON(http.StatusOK, gin.H{
		"employees": employees,
		"count":     len(employees),
	})
}

// GetEmployee retrieves a single employee by ID
func (h *EmployeeHandler) GetEmployee(c *gin.Context) {
	id := c.Param("id")

	query := `
		SELECT e.id, e.employee_id, e.departement_id, e.name, e.address, 
		       e.created_at, e.updated_at,
		       d.id, d.departement_name, d.max_clock_in_time, d.max_clock_out_time
		FROM employee e
		LEFT JOIN departement d ON e.departement_id = d.id
		WHERE e.id = ?
	`

	var emp models.EmployeeWithDepartment
	var dept models.Department
	err := h.db.QueryRow(query, id).Scan(
		&emp.ID, &emp.EmployeeID, &emp.DepartementID, &emp.Name, &emp.Address,
		&emp.CreatedAt, &emp.UpdatedAt,
		&dept.ID, &dept.DepartementName, &dept.MaxClockInTime, &dept.MaxClockOutTime,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employee"})
		return
	}

	emp.Department = dept
	c.JSON(http.StatusOK, gin.H{"employee": emp})
}

// UpdateEmployee updates an existing employee
func (h *EmployeeHandler) UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateEmployeeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if employee exists
	var exists int
	err := h.db.QueryRow("SELECT 1 FROM employee WHERE id = ?", id).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Check if department exists
	var deptExists int
	err = h.db.QueryRow("SELECT 1 FROM departement WHERE id = ?", req.DepartementID).Scan(&deptExists)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Department not found"})
		return
	}

	now := time.Now()
	_, err = h.db.Exec(`
		UPDATE employee 
		SET departement_id = ?, name = ?, address = ?, updated_at = ?
		WHERE id = ?
	`, req.DepartementID, req.Name, req.Address, now, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee updated successfully"})
}

// DeleteEmployee deletes an employee
func (h *EmployeeHandler) DeleteEmployee(c *gin.Context) {
	id := c.Param("id")

	// Check if employee exists
	var exists int
	err := h.db.QueryRow("SELECT 1 FROM employee WHERE id = ?", id).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Check if employee has attendance records
	var attendanceCount int
	err = h.db.QueryRow("SELECT COUNT(*) FROM attendance WHERE employee_id = (SELECT employee_id FROM employee WHERE id = ?)", id).Scan(&attendanceCount)
	if err == nil && attendanceCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete employee with attendance records"})
		return
	}

	_, err = h.db.Exec("DELETE FROM employee WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

// ExportEmployeesCSV exports employee list to CSV file
func (h *EmployeeHandler) ExportEmployeesCSV(c *gin.Context) {
	query := `
		SELECT e.id, e.employee_id, e.departement_id, e.name, e.address, 
		       e.created_at, e.updated_at,
		       d.id, d.departement_name, d.max_clock_in_time, d.max_clock_out_time
		FROM employee e
		LEFT JOIN departement d ON e.departement_id = d.id
		ORDER BY e.created_at DESC
	`

	rows, err := h.db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}
	defer rows.Close()

	var employees []models.EmployeeWithDepartment
	for rows.Next() {
		var emp models.EmployeeWithDepartment
		var dept models.Department
		err := rows.Scan(
			&emp.ID, &emp.EmployeeID, &emp.DepartementID, &emp.Name, &emp.Address,
			&emp.CreatedAt, &emp.UpdatedAt,
			&dept.ID, &dept.DepartementName, &dept.MaxClockInTime, &dept.MaxClockOutTime,
		)
		if err != nil {
			continue
		}
		emp.Department = dept
		employees = append(employees, emp)
	}

	// Create CSV export service
	csvService := services.NewCSVExportService()

	// Generate filename
	filename := csvService.GenerateFilename("employees")
	filepath := filepath.Join("exports", filename)

	// Create exports directory if it doesn't exist
	if err := os.MkdirAll("exports", 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exports directory"})
		return
	}

	// Export to CSV
	if err := csvService.ExportEmployeeList(employees, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to export CSV"})
		return
	}

	// Set response headers for file download
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Expires", "0")
	c.Header("Cache-Control", "must-revalidate")
	c.Header("Pragma", "public")

	// Send file
	c.File(filepath)
}
