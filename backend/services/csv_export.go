package services

import (
	"encoding/csv"
	"fmt"
	"os"
	"time"

	"attendance-system/models"
)

// CSVExportService handles CSV export functionality
type CSVExportService struct{}

// NewCSVExportService creates a new CSV export service
func NewCSVExportService() *CSVExportService {
	return &CSVExportService{}
}

// ExportAttendanceLogs exports attendance logs to CSV format
func (s *CSVExportService) ExportAttendanceLogs(logs []models.AttendanceLog, filename string) error {
	// Create file
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	// Create CSV writer
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := []string{
		"No",
		"Employee ID",
		"Employee Name",
		"Department",
		"Date",
		"Time",
		"Type",
		"Description",
		"Status",
		"Max Clock In",
		"Max Clock Out",
	}
	if err := writer.Write(header); err != nil {
		return fmt.Errorf("failed to write header: %v", err)
	}

	// Write data rows
	for i, log := range logs {
		row := []string{
			fmt.Sprintf("%d", i+1),
			log.EmployeeID,
			log.EmployeeName,
			log.DepartmentName,
			log.DateAttendance.Format("2006-01-02"),
			log.DateAttendance.Format("15:04:05"),
			s.getAttendanceTypeText(log.AttendanceType),
			log.Description,
			s.getStatusText(log.IsOnTime),
			log.MaxClockInTime,
			log.MaxClockOutTime,
		}
		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write row: %v", err)
		}
	}

	return nil
}

// ExportEmployeeList exports employee list to CSV format
func (s *CSVExportService) ExportEmployeeList(employees []models.EmployeeWithDepartment, filename string) error {
	// Create file
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	// Create CSV writer
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := []string{
		"No",
		"Employee ID",
		"Name",
		"Department",
		"Address",
		"Max Clock In",
		"Max Clock Out",
		"Created At",
	}
	if err := writer.Write(header); err != nil {
		return fmt.Errorf("failed to write header: %v", err)
	}

	// Write data rows
	for i, emp := range employees {
		row := []string{
			fmt.Sprintf("%d", i+1),
			emp.EmployeeID,
			emp.Name,
			emp.Department.DepartementName,
			emp.Address,
			emp.Department.MaxClockInTime,
			emp.Department.MaxClockOutTime,
			emp.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write row: %v", err)
		}
	}

	return nil
}

// ExportDepartmentList exports department list to CSV format
func (s *CSVExportService) ExportDepartmentList(departments []models.Department, filename string) error {
	// Create file
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	// Create CSV writer
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := []string{
		"No",
		"Department Name",
		"Max Clock In Time",
		"Max Clock Out Time",
	}
	if err := writer.Write(header); err != nil {
		return fmt.Errorf("failed to write header: %v", err)
	}

	// Write data rows
	for i, dept := range departments {
		row := []string{
			fmt.Sprintf("%d", i+1),
			dept.DepartementName,
			dept.MaxClockInTime,
			dept.MaxClockOutTime,
		}
		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write row: %v", err)
		}
	}

	return nil
}

// GenerateFilename generates a filename with timestamp
func (s *CSVExportService) GenerateFilename(prefix string) string {
	timestamp := time.Now().Format("20060102_150405")
	return fmt.Sprintf("%s_%s.csv", prefix, timestamp)
}

// getAttendanceTypeText converts attendance type to readable text
func (s *CSVExportService) getAttendanceTypeText(attendanceType int) string {
	switch attendanceType {
	case 1:
		return "Clock In"
	case 2:
		return "Clock Out"
	default:
		return "Unknown"
	}
}

// getStatusText converts status to readable text
func (s *CSVExportService) getStatusText(isOnTime bool) string {
	if isOnTime {
		return "On Time"
	}
	return "Late/Early"
}
