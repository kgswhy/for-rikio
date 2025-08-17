-- Sample Attendance Data for Dashboard
-- This will populate the dashboard with some attendance records

USE attendance_system;

-- Insert sample attendance records for today
INSERT INTO attendance (employee_id, attendance_id, clock_in, created_at, updated_at) VALUES
('EMP001', 'att_001_today', NOW() - INTERVAL 2 HOUR, NOW(), NOW()),
('EMP002', 'att_002_today', NOW() - INTERVAL 1 HOUR, NOW(), NOW()),
('EMP003', 'att_003_today', NOW() - INTERVAL 3 HOUR, NOW(), NOW()),
('EMP004', 'att_004_today', NOW() - INTERVAL 30 MINUTE, NOW(), NOW()),
('EMP005', 'att_005_today', NOW() - INTERVAL 1 HOUR, NOW(), NOW());

-- Insert sample attendance records for yesterday
INSERT INTO attendance (employee_id, attendance_id, clock_in, created_at, updated_at) VALUES
('EMP001', 'att_001_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, NOW(), NOW()),
('EMP002', 'att_002_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, NOW(), NOW()),
('EMP003', 'att_003_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, NOW(), NOW()),
('EMP004', 'att_004_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, NOW(), NOW()),
('EMP005', 'att_005_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, NOW(), NOW());

-- Insert attendance history for today (Clock In)
INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at) VALUES
('EMP001', 'att_001_today', NOW() - INTERVAL 2 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP002', 'att_002_today', NOW() - INTERVAL 1 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP003', 'att_003_today', NOW() - INTERVAL 3 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP004', 'att_004_today', NOW() - INTERVAL 30 MINUTE, 1, 'Clock In', NOW(), NOW()),
('EMP005', 'att_005_today', NOW() - INTERVAL 1 HOUR, 1, 'Clock In', NOW(), NOW());

-- Insert attendance history for today (Clock Out) - some employees
INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at) VALUES
('EMP001', 'att_001_today', NOW() - INTERVAL 30 MINUTE, 2, 'Clock Out', NOW(), NOW()),
('EMP002', 'att_002_today', NOW() - INTERVAL 15 MINUTE, 2, 'Clock Out', NOW(), NOW()),
('EMP003', 'att_003_today', NOW() - INTERVAL 45 MINUTE, 2, 'Clock Out', NOW(), NOW());

-- Insert attendance history for yesterday (Clock In)
INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at) VALUES
('EMP001', 'att_001_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP002', 'att_002_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP003', 'att_003_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP004', 'att_004_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 1, 'Clock In', NOW(), NOW()),
('EMP005', 'att_005_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 1, 'Clock In', NOW(), NOW());

-- Insert attendance history for yesterday (Clock Out)
INSERT INTO attendance_history (employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at) VALUES
('EMP001', 'att_001_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 2, 'Clock Out', NOW(), NOW()),
('EMP002', 'att_002_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 2, 'Clock Out', NOW(), NOW()),
('EMP003', 'att_003_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 2, 'Clock Out', NOW(), NOW()),
('EMP004', 'att_004_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 2, 'Clock Out', NOW(), NOW()),
('EMP005', 'att_005_yesterday', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 2, 'Clock Out', NOW(), NOW());
