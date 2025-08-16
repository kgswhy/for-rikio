package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"path/filepath"

	"attendance-system/models"
	"attendance-system/services"

	"github.com/gin-gonic/gin"
)

// DepartmentHandler handles department-related HTTP requests
type DepartmentHandler struct {
	db *sql.DB
}

// NewDepartmentHandler creates a new department handler
func NewDepartmentHandler(db *sql.DB) *DepartmentHandler {
	return &DepartmentHandler{db: db}
}

// CreateDepartment creates a new department
func (h *DepartmentHandler) CreateDepartment(c *gin.Context) {
	var req models.CreateDepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.db.Exec(`
		INSERT INTO departement (departement_name, max_clock_in_time, max_clock_out_time)
		VALUES (?, ?, ?)
	`, req.DepartementName, req.MaxClockInTime, req.MaxClockOutTime)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create department"})
		return
	}

	id, _ := result.LastInsertId()
	department := models.Department{
		ID:              int(id),
		DepartementName: req.DepartementName,
		MaxClockInTime:  req.MaxClockInTime,
		MaxClockOutTime: req.MaxClockOutTime,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Department created successfully",
		"department": department,
	})
}

// GetDepartments retrieves all departments
func (h *DepartmentHandler) GetDepartments(c *gin.Context) {
	query := `
		SELECT id, departement_name, max_clock_in_time, max_clock_out_time
		FROM departement
		ORDER BY departement_name
	`

	rows, err := h.db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch departments"})
		return
	}
	defer rows.Close()

	var departments []models.Department
	for rows.Next() {
		var dept models.Department
		err := rows.Scan(
			&dept.ID,
			&dept.DepartementName,
			&dept.MaxClockInTime,
			&dept.MaxClockOutTime,
		)
		if err != nil {
			continue
		}
		departments = append(departments, dept)
	}

	c.JSON(http.StatusOK, gin.H{
		"departments": departments,
		"count":       len(departments),
	})
}

// GetDepartment retrieves a single department by ID
func (h *DepartmentHandler) GetDepartment(c *gin.Context) {
	id := c.Param("id")

	var dept models.Department
	err := h.db.QueryRow(`
		SELECT id, departement_name, max_clock_in_time, max_clock_out_time
		FROM departement
		WHERE id = ?
	`, id).Scan(&dept.ID, &dept.DepartementName, &dept.MaxClockInTime, &dept.MaxClockOutTime)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch department"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"department": dept})
}

func (h *DepartmentHandler) UpdateDepartment(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateDepartmentRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if department exists
	var exists int
	err := h.db.QueryRow("SELECT 1 FROM departement WHERE id = ?", id).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}

	_, err = h.db.Exec(`
		UPDATE departement 
		SET departement_name = ?, max_clock_in_time = ?, max_clock_out_time = ?
		WHERE id = ?
	`, req.DepartementName, req.MaxClockInTime, req.MaxClockOutTime, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Department updated successfully"})
}

// DeleteDepartment deletes a department
func (h *DepartmentHandler) DeleteDepartment(c *gin.Context) {
	id := c.Param("id")

	// Check if department exists
	var exists int
	err := h.db.QueryRow("SELECT 1 FROM departement WHERE id = ?", id).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}

	// Check if department has employees
	var employeeCount int
	err = h.db.QueryRow("SELECT COUNT(*) FROM employee WHERE departement_id = ?", id).Scan(&employeeCount)
	if err == nil && employeeCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete department with employees"})
		return
	}

	_, err = h.db.Exec("DELETE FROM departement WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete department"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Department deleted successfully"})
}

// ExportDepartmentsCSV exports department list to CSV file
func (h *DepartmentHandler) ExportDepartmentsCSV(c *gin.Context) {
	query := `
		SELECT id, departement_name, max_clock_in_time, max_clock_out_time
		FROM departement
		ORDER BY departement_name
	`

	rows, err := h.db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch departments"})
		return
	}
	defer rows.Close()

	var departments []models.Department
	for rows.Next() {
		var dept models.Department
		err := rows.Scan(
			&dept.ID,
			&dept.DepartementName,
			&dept.MaxClockInTime,
			&dept.MaxClockOutTime,
		)
		if err != nil {
			continue
		}
		departments = append(departments, dept)
	}

	// Create CSV export service
	csvService := services.NewCSVExportService()

	// Generate filename
	filename := csvService.GenerateFilename("departments")
	filepath := filepath.Join("exports", filename)

	// Create exports directory if it doesn't exist
	if err := os.MkdirAll("exports", 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exports directory"})
		return
	}

	// Export to CSV
	if err := csvService.ExportDepartmentList(departments, filepath); err != nil {
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
