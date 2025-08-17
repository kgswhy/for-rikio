import axios, { AxiosError } from 'axios';
import {
  Employee,
  EmployeeWithDepartment,
  Department,
  AttendanceLog,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ClockInRequest,
  ClockOutRequest,
  AttendanceFilter,
  EmployeesResponse,
  DepartmentsResponse,
  AttendanceLogsResponse,
  ApiResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API
export const employeeApi = {
  // Get all employees
  getAll: async (): Promise<EmployeesResponse> => {
    const response = await api.get('/api/v1/employees/');
    return response.data;
  },

  // Get employee by ID
  getById: async (id: number): Promise<{ employee: EmployeeWithDepartment }> => {
    const response = await api.get(`/api/v1/employees/${id}`);
    return response.data;
  },

  // Create employee
  create: async (data: CreateEmployeeRequest): Promise<{ message: string; employee: Employee }> => {
    const response = await api.post('/api/v1/employees/', data);
    return response.data;
  },

  // Update employee
  update: async (id: number, data: UpdateEmployeeRequest): Promise<{ message: string }> => {
    const response = await api.put(`/api/v1/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/employees/${id}`);
    return response.data;
  },
};

// Department API
export const departmentApi = {
  // Get all departments
  getAll: async (): Promise<DepartmentsResponse> => {
    const response = await api.get('/api/v1/departments/');
    return response.data;
  },

  // Get department by ID
  getById: async (id: number): Promise<{ department: Department }> => {
    const response = await api.get(`/api/v1/departments/${id}`);
    return response.data;
  },

  // Create department
  create: async (data: CreateDepartmentRequest): Promise<{ message: string; department: Department }> => {
    const response = await api.post('/api/v1/departments/', data);
    return response.data;
  },

  // Update department
  update: async (id: number, data: UpdateDepartmentRequest): Promise<{ message: string }> => {
    const response = await api.put(`/api/v1/departments/${id}`, data);
    return response.data;
  },

  // Delete department
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/departments/${id}`);
    return response.data;
  },
};

// Attendance API
export const attendanceApi = {
  // Clock in
  clockIn: async (data: ClockInRequest): Promise<{
    message: string;
    attendance_id: string;
    clock_in_time: string;
    is_on_time: boolean;
  }> => {
    try {
      const response = await api.post('/api/v1/attendance/clock-in', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.status === 409) {
        throw new Error('Employee has already clocked in today');
      }
      throw new Error(axiosError.response?.data?.error || 'Failed to clock in');
    }
  },

  // Clock out
  clockOut: async (data: ClockOutRequest): Promise<{
    message: string;
    attendance_id: string;
    clock_in_time: string;
    clock_out_time: string;
    is_on_time: boolean;
  }> => {
    try {
      const response = await api.put('/api/v1/attendance/clock-out', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.status === 409) {
        throw new Error('Employee has already clocked out today');
      }
      if (axiosError.response?.status === 400) {
        throw new Error('No active clock in found for today');
      }
      throw new Error(axiosError.response?.data?.error || 'Failed to clock out');
    }
  },

  // Get attendance logs
  getLogs: async (filters?: AttendanceFilter): Promise<AttendanceLogsResponse> => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());
    
    const response = await api.get(`/api/v1/attendance/logs?${params.toString()}`);
    return response.data;
  },

  // Get current attendance status for an employee
  getCurrentStatus: async (employeeId: string): Promise<{
    has_clocked_in: boolean;
    has_clocked_out: boolean;
    clock_in_time?: string;
    clock_out_time?: string;
  }> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/api/v1/attendance/logs?date=${today}`);
      
      const employeeLogs = response.data.attendance_logs.filter(
        (log: AttendanceLog) => log.employee_id === employeeId
      );
      
      const hasClockIn = employeeLogs.some((log: AttendanceLog) => log.attendance_type === 1);
      const hasClockOut = employeeLogs.some((log: AttendanceLog) => log.attendance_type === 2);
      
      const clockInLog = employeeLogs.find((log: AttendanceLog) => log.attendance_type === 1);
      const clockOutLog = employeeLogs.find((log: AttendanceLog) => log.attendance_type === 2);
      
      return {
        has_clocked_in: hasClockIn,
        has_clocked_out: hasClockOut,
        clock_in_time: clockInLog?.date_attendance,
        clock_out_time: clockOutLog?.date_attendance,
      };
    } catch (error) {
      return {
        has_clocked_in: false,
        has_clocked_out: false,
      };
    }
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// CSV Export API
export const csvExportApi = {
  // Export attendance logs to CSV
  exportAttendanceLogs: async (filters?: AttendanceFilter): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());
    
    const response = await api.get(`/api/v1/attendance/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export employees to CSV
  exportEmployees: async (): Promise<Blob> => {
    const response = await api.get('/api/v1/employees/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export departments to CSV
  exportDepartments: async (): Promise<Blob> => {
    const response = await api.get('/api/v1/departments/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
