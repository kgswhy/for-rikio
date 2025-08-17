'use client';

import { useState, useEffect } from 'react';
import { 
  ClockIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { attendanceApi, employeeApi, departmentApi, csvExportApi } from '@/lib/api';
import { AttendanceLog, EmployeeWithDepartment, Department, AttendanceFilter } from '@/types';
import Layout from '@/components/layout/Layout';
import AttendanceModal from '@/components/attendance/AttendanceModal';
import { 
  formatDate, 
  getAttendanceTypeLabel, 
  getAttendanceStatusColor, 
  getAttendanceStatusIcon,
  downloadCSV
} from '@/lib/utils';

export default function AttendancePage() {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [employees, setEmployees] = useState<EmployeeWithDepartment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'clock-in' | 'clock-out'>('clock-in');
  const [filters, setFilters] = useState<AttendanceFilter>({});

  useEffect(() => {
    fetchAttendanceLogs();
    fetchEmployees();
    fetchDepartments();
  }, [filters]);

  const fetchAttendanceLogs = async () => {
    try {
      const response = await attendanceApi.getLogs(filters);
      setAttendanceLogs(response.attendance_logs || []);
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleClockIn = async (employeeId: string) => {
    try {
      await attendanceApi.clockIn({ employee_id: employeeId });
      fetchAttendanceLogs();
      setIsModalOpen(false);
    } catch (error) {
      // Error is now handled in the modal component
      throw error;
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      await attendanceApi.clockOut({ employee_id: employeeId });
      fetchAttendanceLogs();
      setIsModalOpen(false);
    } catch (error) {
      // Error is now handled in the modal component
      throw error;
    }
  };

  const handleFilterChange = (key: keyof AttendanceFilter, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleExportCSV = async () => {
    try {
      const blob = await csvExportApi.exportAttendanceLogs(filters);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `attendance_logs_${timestamp}.csv`;
      downloadCSV(blob, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(`Failed to export CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage employee attendance and view attendance logs
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setModalType('clock-in');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <ClockIcon className="mr-2 h-4 w-4" />
              Clock In
            </button>
            <button
              onClick={() => {
                setModalType('clock-out');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <ClockIcon className="mr-2 h-4 w-4" />
              Clock Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FunnelIcon className="mr-2 h-5 w-5" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={filters.date || ''}
                onChange={(e) => handleFilterChange('date', e.target.value || undefined)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                value={filters.department_id || ''}
                onChange={(e) => handleFilterChange('department_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departement_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Logs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Attendance Logs
              </h3>
              <button 
                onClick={handleExportCSV}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="mr-1 h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {(attendanceLogs || []).map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          log.is_on_time ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className={`text-sm font-medium ${
                            log.is_on_time ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {getAttendanceStatusIcon(log.is_on_time)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {log.employee_name}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.attendance_type === 1 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {getAttendanceTypeLabel(log.attendance_type)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p className="mr-4">Department: {log.department_name}</p>
                          <p>Time: {formatDate(log.date_attendance, 'HH:mm')}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Date: {formatDate(log.date_attendance, 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getAttendanceStatusColor(log.is_on_time)}`}>
                        {log.is_on_time ? 'On Time' : 'Late/Early'}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {(attendanceLogs || []).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance logs found.</p>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        employees={employees}
        onSubmit={modalType === 'clock-in' ? handleClockIn : handleClockOut}
      />
    </Layout>
  );
}
