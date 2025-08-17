'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { EmployeeWithDepartment } from '@/types';
import { attendanceApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'clock-in' | 'clock-out';
  employees: EmployeeWithDepartment[];
  onSubmit: (employeeId: string) => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  type,
  employees,
  onSubmit
}: AttendanceModalProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [currentStatus, setCurrentStatus] = useState<{
    has_clocked_in: boolean;
    has_clocked_out: boolean;
    clock_in_time?: string;
    clock_out_time?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchCurrentStatus(selectedEmployeeId);
    } else {
      setCurrentStatus(null);
      setError(null);
    }
  }, [selectedEmployeeId]);

  const fetchCurrentStatus = async (employeeId: string) => {
    try {
      const status = await attendanceApi.getCurrentStatus(employeeId);
      setCurrentStatus(status);
      setError(null);
    } catch (err) {
      setCurrentStatus(null);
      setError('Failed to fetch current status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit(selectedEmployeeId);
      setSelectedEmployeeId('');
      setCurrentStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const canClockIn = selectedEmployeeId && currentStatus && !currentStatus.has_clocked_in;
  const canClockOut = selectedEmployeeId && currentStatus && currentStatus.has_clocked_in && !currentStatus.has_clocked_out;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              type === 'clock-in' ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <ClockIcon className={`h-4 w-4 ${
                type === 'clock-in' ? 'text-green-600' : 'text-orange-600'
              }`} />
            </div>
            {type === 'clock-in' ? 'Clock In' : 'Clock Out'}
          </DialogTitle>
          <DialogDescription>
            {type === 'clock-in' ? 'Record employee arrival' : 'Record employee departure'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee" className="text-sm font-medium">
                Select Employee
              </Label>
              <div className="relative">
                <UserIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Choose an employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.employee_id}>
                        {employee.employee_id} - {employee.name} ({employee.department.departement_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex">
                  <XCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedEmployeeId && currentStatus && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex gap-2 items-center text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    Today&apos;s Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Clock In:</span>
                    <div className="flex items-center">
                      {currentStatus.has_clocked_in ? (
                        <>
                          <CheckCircleIcon className="mr-2 w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            {currentStatus.clock_in_time ? formatDate(currentStatus.clock_in_time, 'HH:mm') : 'Done'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="mr-2 w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Not done</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700">Clock Out:</span>
                    <div className="flex items-center">
                      {currentStatus.has_clocked_out ? (
                        <>
                          <CheckCircleIcon className="mr-2 w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            {currentStatus.clock_out_time ? formatDate(currentStatus.clock_out_time, 'HH:mm') : 'Done'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="mr-2 w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Not done</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedEmployeeId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex gap-2 items-center text-sm">
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const employee = employees.find(emp => emp.employee_id === selectedEmployeeId);
                    if (!employee) return null;
                    
                    return (
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Name:</span>
                          <span>{employee.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Department:</span>
                          <span>{employee.department.departement_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Max Clock In:</span>
                          <span className="font-mono">{employee.department.max_clock_in_time.substring(0, 5)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Max Clock Out:</span>
                          <span className="font-mono">{employee.department.max_clock_out_time.substring(0, 5)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (type === 'clock-in' ? !canClockIn : !canClockOut)}
              className={type === 'clock-in' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
              ) : (
                type === 'clock-in' ? 'Clock In' : 'Clock Out'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
