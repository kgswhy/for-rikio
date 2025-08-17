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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
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
            <Button
              onClick={() => {
                setModalType('clock-in');
                setIsModalOpen(true);
              }}
              className="flex gap-2 items-center bg-green-600 hover:bg-green-700"
            >
              <ClockIcon className="w-4 h-4" />
              Clock In
            </Button>
            <Button
              onClick={() => {
                setModalType('clock-out');
                setIsModalOpen(true);
              }}
              className="flex gap-2 items-center bg-orange-600 hover:bg-orange-700"
            >
              <ClockIcon className="w-4 h-4" />
              Clock Out
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex gap-2 items-center text-lg">
                <FunnelIcon className="w-5 h-5" />
                Filters
              </CardTitle>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
              >
                Clear filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={filters.date || ''}
                  onChange={(e) => handleFilterChange('date', e.target.value || undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={filters.department_id?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('department_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.departement_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Logs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Attendance Logs</CardTitle>
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="flex gap-2 items-center"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(attendanceLogs || []).map((log) => (
                <div key={log.id} className="flex justify-between items-center p-4 rounded-lg border transition-colors hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      log.is_on_time ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        log.is_on_time ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {getAttendanceStatusIcon(log.is_on_time)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {log.employee_name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.attendance_type === 1 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {getAttendanceTypeLabel(log.attendance_type)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <span>Department: {log.department_name}</span>
                        <span>Time: {formatDate(log.date_attendance, 'HH:mm')}</span>
                        <span>Date: {formatDate(log.date_attendance, 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getAttendanceStatusColor(log.is_on_time)}`}>
                      {log.is_on_time ? 'On Time' : 'Late/Early'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {(attendanceLogs || []).length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">No attendance logs found.</p>
              </div>
            )}
          </CardContent>
        </Card>
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
