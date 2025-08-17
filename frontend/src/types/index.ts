export interface Employee {
  id: number;
  employee_id: string;
  departement_id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithDepartment extends Employee {
  department: Department;
}

export interface Department {
  id: number;
  departement_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export interface Attendance {
  id: number;
  employee_id: string;
  attendance_id: string;
  clock_in: string;
  clock_out?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: number;
  employee_id: string;
  employee_name: string;
  department_id: number;
  department_name: string;
  attendance_id: string;
  date_attendance: string;
  attendance_type: number; // 1 = In, 2 = Out
  description: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
  is_on_time: boolean;
  created_at: string;
}

export interface CreateEmployeeRequest {
  employee_id: string;
  departement_id: number;
  name: string;
  address: string;
}

export interface UpdateEmployeeRequest {
  departement_id: number;
  name: string;
  address: string;
}

export interface CreateDepartmentRequest {
  departement_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export interface UpdateDepartmentRequest {
  departement_name: string;
  max_clock_in_time: string;
  max_clock_out_time: string;
}

export interface ClockInRequest {
  employee_id: string;
}

export interface ClockOutRequest {
  employee_id: string;
}

export interface AttendanceFilter {
  date?: string;
  department_id?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

export interface EmployeesResponse extends ApiResponse<EmployeeWithDepartment[]> {
  employees: EmployeeWithDepartment[];
  count: number;
}

export interface DepartmentsResponse extends ApiResponse<Department[]> {
  departments: Department[];
  count: number;
}

export interface AttendanceLogsResponse extends ApiResponse<AttendanceLog[]> {
  attendance_logs: AttendanceLog[];
  count: number;
  filters: AttendanceFilter;
}
