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
	"github.com/google/uuid"
)

// AttendanceHandler handles attendance-related HTTP requests
type AttendanceHandler struct {
	db *sql.DB
}

// NewAttendanceHandler creates a new attendance handler
func NewAttendanceHandler(db *sql.DB) *AttendanceHandler {
	return &AttendanceHandler{db: db}
}

// ClockIn handles employee clock in
func (h *AttendanceHandler) ClockIn(c *gin.Context) {
	var req models.ClockInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if employee exists
	var employeeID string
	var departmentID int
	var maxClockInTime string
	err := h.db.QueryRow(`
		SELECT e.employee_id, e.departement_id, d.max_clock_in_time
		FROM employee e
		LEFT JOIN departement d ON e.departement_id = d.id
		WHERE e.employee_id = ?
	`, req.EmployeeID).Scan(&employeeID, &departmentID, &maxClockInTime)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employee"})
		return
	}

	now := time.Now()
	today := now.Format("2006-01-02")

	// Check if already clocked in today
	var existingAttendanceID string
	err = h.db.QueryRow(`
		SELECT attendance_id FROM attendance 
		WHERE employee_id = ? AND DATE(clock_in) = ?
	`, req.EmployeeID, today).Scan(&existingAttendanceID)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already clocked in today"})
		return
	}

	// Generate attendance ID
	attendanceID := uuid.New().String()

	// Check if on time
	isOnTime := true
	if maxClockInTime != "" {
		maxTime, err := time.Parse("15:04:05", maxClockInTime)
		if err == nil {
			currentTime := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second(), 0, now.Location())
			maxTimeToday := time.Date(now.Year(), now.Month(), now.Day(), maxTime.Hour(), maxTime.Minute(), maxTime.Second(), 0, now.Location())
			isOnTime = currentTime.Before(maxTimeToday) || currentTime.Equal(maxTimeToday)
		}
	}

	// Insert attendance record
	_, err = h.db.Exec(`
		INSERT INTO attendance (employee_id, attendance_id, clock_in, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?)
	`, req.EmployeeID, attendanceID, now, now, now)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clock in"})
		return
	}

	// Insert attendance history
	description := "Clock In"
	if !isOnTime {
		description = "Clock In (Late)"
	}

	_, err = h.db.Exec(`
		INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, req.EmployeeID, attendanceID, now, 1, description, now, now)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attendance history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Clock in successful",
		"attendance_id": attendanceID,
		"clock_in_time": now.Format("2006-01-02 15:04:05"),
		"is_on_time":    isOnTime,
	})
}

// ClockOut handles employee clock out
func (h *AttendanceHandler) ClockOut(c *gin.Context) {
	var req models.ClockOutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if employee exists
	var employeeID string
	var departmentID int
	var maxClockOutTime string
	err := h.db.QueryRow(`
		SELECT e.employee_id, e.departement_id, d.max_clock_out_time
		FROM employee e
		LEFT JOIN departement d ON e.departement_id = d.id
		WHERE e.employee_id = ?
	`, req.EmployeeID).Scan(&employeeID, &departmentID, &maxClockOutTime)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employee"})
		return
	}

	now := time.Now()
	today := now.Format("2006-01-02")

	// Check if already clocked in today and not clocked out
	var attendanceID string
	var clockInTime time.Time
	err = h.db.QueryRow(`
		SELECT attendance_id, clock_in FROM attendance 
		WHERE employee_id = ? AND DATE(clock_in) = ? AND clock_out IS NULL
	`, req.EmployeeID, today).Scan(&attendanceID, &clockInTime)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No active clock in found for today"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance"})
		return
	}

	// Check if already clocked out
	var clockOutTime *time.Time
	err = h.db.QueryRow(`
		SELECT clock_out FROM attendance 
		WHERE attendance_id = ?
	`, attendanceID).Scan(&clockOutTime)

	if err == nil && clockOutTime != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already clocked out today"})
		return
	}

	// Check if on time for clock out
	isOnTime := true
	if maxClockOutTime != "" {
		maxTime, err := time.Parse("15:04:05", maxClockOutTime)
		if err == nil {
			currentTime := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second(), 0, now.Location())
			maxTimeToday := time.Date(now.Year(), now.Month(), now.Day(), maxTime.Hour(), maxTime.Minute(), maxTime.Second(), 0, now.Location())
			isOnTime = currentTime.After(maxTimeToday) || currentTime.Equal(maxTimeToday)
		}
	}

	// Update attendance record
	_, err = h.db.Exec(`
		UPDATE attendance 
		SET clock_out = ?, updated_at = ?
		WHERE attendance_id = ?
	`, now, now, attendanceID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clock out"})
		return
	}

	// Insert attendance history
	description := "Clock Out"
	if !isOnTime {
		description = "Clock Out (Early)"
	}

	_, err = h.db.Exec(`
		INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, req.EmployeeID, attendanceID, now, 2, description, now, now)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attendance history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Clock out successful",
		"attendance_id":  attendanceID,
		"clock_in_time":  clockInTime.Format("2006-01-02 15:04:05"),
		"clock_out_time": now.Format("2006-01-02 15:04:05"),
		"is_on_time":     isOnTime,
	})
}

// GetAttendanceLogs retrieves attendance logs with filtering
func (h *AttendanceHandler) GetAttendanceLogs(c *gin.Context) {
	var filter models.AttendanceFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build query with filters
	query := `
		SELECT 
			ah.id,
			ah.employee_id,
			e.name as employee_name,
			e.departement_id as department_id,
			d.departement_name as department_name,
			ah.attendance_id,
			ah.date_attendance,
			ah.attendance_type,
			ah.description,
			d.max_clock_in_time,
			d.max_clock_out_time,
			ah.created_at,
			CASE 
				WHEN ah.attendance_type = 1 THEN 
					CASE 
						WHEN TIME(ah.date_attendance) <= d.max_clock_in_time THEN 1
						ELSE 0
					END
				WHEN ah.attendance_type = 2 THEN 
					CASE 
						WHEN TIME(ah.date_attendance) >= d.max_clock_out_time THEN 1
						ELSE 0
					END
				ELSE 0
			END as is_on_time
		FROM attendance_history ah
		LEFT JOIN employee e ON ah.employee_id = e.employee_id
		LEFT JOIN departement d ON e.departement_id = d.id
		WHERE 1=1
	`

	var args []interface{}

	// Add date filter
	if filter.Date != "" {
		query += " AND DATE(ah.date_attendance) = ?"
		args = append(args, filter.Date)
	}

	// Add department filter
	if filter.DepartmentID > 0 {
		query += " AND e.departement_id = ?"
		args = append(args, filter.DepartmentID)
	}

	query += " ORDER BY ah.date_attendance DESC"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance logs"})
		return
	}
	defer rows.Close()

	var logs []models.AttendanceLog
	for rows.Next() {
		var log models.AttendanceLog
		var isOnTimeInt int
		err := rows.Scan(
			&log.ID,
			&log.EmployeeID,
			&log.EmployeeName,
			&log.DepartmentID,
			&log.DepartmentName,
			&log.AttendanceID,
			&log.DateAttendance,
			&log.AttendanceType,
			&log.Description,
			&log.MaxClockInTime,
			&log.MaxClockOutTime,
			&log.CreatedAt,
			&isOnTimeInt,
		)
		if err != nil {
			continue
		}
		log.IsOnTime = isOnTimeInt == 1
		logs = append(logs, log)
	}

	c.JSON(http.StatusOK, gin.H{
		"attendance_logs": logs,
		"count":           len(logs),
		"filters":         filter,
	})
}

// ExportAttendanceLogsCSV exports attendance logs to CSV file
func (h *AttendanceHandler) ExportAttendanceLogsCSV(c *gin.Context) {
	var filter models.AttendanceFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build query with filters (same as GetAttendanceLogs)
	query := `
		SELECT 
			ah.id,
			ah.employee_id,
			e.name as employee_name,
			e.departement_id as department_id,
			d.departement_name as department_name,
			ah.attendance_id,
			ah.date_attendance,
			ah.attendance_type,
			ah.description,
			d.max_clock_in_time,
			d.max_clock_out_time,
			ah.created_at,
			CASE 
				WHEN ah.attendance_type = 1 THEN 
					CASE 
						WHEN TIME(ah.date_attendance) <= d.max_clock_in_time THEN 1
						ELSE 0
					END
				WHEN ah.attendance_type = 2 THEN 
					CASE 
						WHEN TIME(ah.date_attendance) >= d.max_clock_out_time THEN 1
						ELSE 0
					END
				ELSE 0
			END as is_on_time
		FROM attendance_history ah
		LEFT JOIN employee e ON ah.employee_id = e.employee_id
		LEFT JOIN departement d ON e.departement_id = d.id
		WHERE 1=1
	`

	var args []interface{}

	// Add date filter
	if filter.Date != "" {
		query += " AND DATE(ah.date_attendance) = ?"
		args = append(args, filter.Date)
	}

	// Add department filter
	if filter.DepartmentID > 0 {
		query += " AND e.departement_id = ?"
		args = append(args, filter.DepartmentID)
	}

	query += " ORDER BY ah.date_attendance DESC"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance logs"})
		return
	}
	defer rows.Close()

	var logs []models.AttendanceLog
	for rows.Next() {
		var log models.AttendanceLog
		var isOnTimeInt int
		err := rows.Scan(
			&log.ID,
			&log.EmployeeID,
			&log.EmployeeName,
			&log.DepartmentID,
			&log.DepartmentName,
			&log.AttendanceID,
			&log.DateAttendance,
			&log.AttendanceType,
			&log.Description,
			&log.MaxClockInTime,
			&log.MaxClockOutTime,
			&log.CreatedAt,
			&isOnTimeInt,
		)
		if err != nil {
			continue
		}
		log.IsOnTime = isOnTimeInt == 1
		logs = append(logs, log)
	}

	// Create CSV export service
	csvService := services.NewCSVExportService()

	// Generate filename
	filename := csvService.GenerateFilename("attendance_logs")
	filepath := filepath.Join("exports", filename)

	// Create exports directory if it doesn't exist
	if err := os.MkdirAll("exports", 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exports directory"})
		return
	}

	// Export to CSV
	if err := csvService.ExportAttendanceLogs(logs, filepath); err != nil {
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
