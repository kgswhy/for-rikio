-- Attendance System Database Schema
-- Based on the provided ERD

-- Create database
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Department table
CREATE TABLE IF NOT EXISTS departement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departement_name VARCHAR(255) NOT NULL,
    max_clock_in_time TIME NOT NULL,
    max_clock_out_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    departement_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departement_id) REFERENCES departement(id) ON DELETE RESTRICT
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    attendance_id VARCHAR(100) UNIQUE NOT NULL,
    clock_in TIMESTAMP NOT NULL,
    clock_out TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

-- Attendance History table
CREATE TABLE IF NOT EXISTS attendance_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    attendance_id VARCHAR(100) NOT NULL,
    date_attendance TIMESTAMP NOT NULL,
    attendance_type TINYINT(1) NOT NULL COMMENT '1 = In, 2 = Out',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_employee_department ON employee(departement_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(clock_in);
CREATE INDEX idx_attendance_history_employee ON attendance_history(employee_id);
CREATE INDEX idx_attendance_history_date ON attendance_history(date_attendance);
CREATE INDEX idx_attendance_history_type ON attendance_history(attendance_type);

-- Insert sample departments
INSERT INTO departement (departement_name, max_clock_in_time, max_clock_out_time) VALUES
('IT Department', '08:30:00', '17:30:00'),
('HR Department', '08:00:00', '17:00:00'),
('Finance Department', '08:15:00', '17:15:00'),
('Marketing Department', '09:00:00', '18:00:00'),
('Operations Department', '07:30:00', '16:30:00');

-- Insert sample employees
INSERT INTO employee (employee_id, departement_id, name, address) VALUES
('EMP001', 1, 'John Doe', '123 Main Street, City'),
('EMP002', 1, 'Jane Smith', '456 Oak Avenue, Town'),
('EMP003', 2, 'Bob Johnson', '789 Pine Road, Village'),
('EMP004', 3, 'Alice Brown', '321 Elm Street, Borough'),
('EMP005', 4, 'Charlie Wilson', '654 Maple Drive, District');
