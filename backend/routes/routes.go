package routes

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"attendance-system/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var startTime = time.Now()

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine, db *sql.DB) {
	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Initialize handlers
	employeeHandler := handlers.NewEmployeeHandler(db)
	departmentHandler := handlers.NewDepartmentHandler(db)
	attendanceHandler := handlers.NewAttendanceHandler(db)

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Employee routes
		employees := v1.Group("/employees")
		{
			employees.POST("/", employeeHandler.CreateEmployee)
			employees.GET("/", employeeHandler.GetEmployees)
			employees.GET("/:id", employeeHandler.GetEmployee)
			employees.PUT("/:id", employeeHandler.UpdateEmployee)
			employees.DELETE("/:id", employeeHandler.DeleteEmployee)
			employees.GET("/export/csv", employeeHandler.ExportEmployeesCSV)
		}

		// Department routes
		departments := v1.Group("/departments")
		{
			departments.POST("/", departmentHandler.CreateDepartment)
			departments.GET("/", departmentHandler.GetDepartments)
			departments.GET("/:id", departmentHandler.GetDepartment)
			departments.PUT("/:id", departmentHandler.UpdateDepartment)
			departments.DELETE("/:id", departmentHandler.DeleteDepartment)
			departments.GET("/export/csv", departmentHandler.ExportDepartmentsCSV)
		}

		// Attendance routes
		attendance := v1.Group("/attendance")
		{
			attendance.POST("/clock-in", attendanceHandler.ClockIn)
			attendance.PUT("/clock-out", attendanceHandler.ClockOut)
			attendance.GET("/export/csv", attendanceHandler.ExportAttendanceLogsCSV)
			attendance.GET("/logs", attendanceHandler.GetAttendanceLogs)
		}
	}

	// Enhanced health check endpoint
	r.GET("/health", func(c *gin.Context) {
		// Check database connection
		var dbStatus string
		if err := db.Ping(); err != nil {
			dbStatus = "disconnected"
		} else {
			dbStatus = "connected"
		}

		uptime := time.Since(startTime)
		uptimeStr := fmt.Sprintf("%.0fs", uptime.Seconds())

		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"message":   "Attendance System API is running",
			"uptime":    uptimeStr,
			"database":  dbStatus,
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// Root endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to Attendance System API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"employees":   "/api/v1/employees",
				"departments": "/api/v1/departments",
				"attendance":  "/api/v1/attendance",
				"health":      "/health",
			},
		})
	})
}
