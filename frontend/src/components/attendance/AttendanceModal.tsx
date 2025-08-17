'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { EmployeeWithDepartment } from '@/types';
import { attendanceApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-6 pr-6">
            <button
              type="button"
              className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="flex items-center mb-6">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-xl leading-6 font-semibold text-gray-900">
                    {type === 'clock-in' ? 'Clock In' : 'Clock Out'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {type === 'clock-in' ? 'Record employee arrival' : 'Record employee departure'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="employee" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Employee
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="employee"
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200 hover:border-gray-400 appearance-none bg-white"
                      required
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.employee_id}>
                          {employee.employee_id} - {employee.name} ({employee.department.departement_name})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <XCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEmployeeId && currentStatus && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                         <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                       <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                       Today&apos;s Status
                     </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-white rounded-md">
                        <span className="text-sm font-medium text-gray-700">Clock In:</span>
                        <div className="flex items-center">
                          {currentStatus.has_clocked_in ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-green-600">
                                {currentStatus.clock_in_time ? formatDate(currentStatus.clock_in_time, 'HH:mm') : 'Done'}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">Not done</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-md">
                        <span className="text-sm font-medium text-gray-700">Clock Out:</span>
                        <div className="flex items-center">
                          {currentStatus.has_clocked_out ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-green-600">
                                {currentStatus.clock_out_time ? formatDate(currentStatus.clock_out_time, 'HH:mm') : 'Done'}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">Not done</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEmployeeId && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                      Employee Information
                    </h4>
                    {(() => {
                      const employee = employees.find(emp => emp.employee_id === selectedEmployeeId);
                      if (!employee) return null;
                      
                      return (
                        <div className="text-sm text-gray-700 space-y-2">
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
                  </div>
                )}

                <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    disabled={loading || (type === 'clock-in' ? !canClockIn : !canClockOut)}
                    className={`w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-6 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      type === 'clock-in' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                        : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                    }`}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      type === 'clock-in' ? 'Clock In' : 'Clock Out'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
