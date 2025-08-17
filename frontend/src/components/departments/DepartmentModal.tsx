'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Department, CreateDepartmentRequest } from '@/types';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ((data: CreateDepartmentRequest) => void | Promise<void>) | ((id: number, data: CreateDepartmentRequest) => void | Promise<void>);
  department?: Department | null;
}

export default function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  department
}: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    departement_name: '',
    max_clock_in_time: '08:30:00',
    max_clock_out_time: '17:30:00'
  });

  useEffect(() => {
    if (department) {
      setFormData({
        departement_name: department.departement_name,
        max_clock_in_time: department.max_clock_in_time,
        max_clock_out_time: department.max_clock_out_time
      });
    } else {
      setFormData({
        departement_name: '',
        max_clock_in_time: '08:30:00',
        max_clock_out_time: '17:30:00'
      });
    }
  }, [department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (department) {
      (onSubmit as (id: number, data: CreateDepartmentRequest) => void | Promise<void>)(department.id, formData);
    } else {
      (onSubmit as (data: CreateDepartmentRequest) => void | Promise<void>)(formData);
    }
  };

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
              className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="flex items-center mb-6">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-xl leading-6 font-semibold text-gray-900">
                    {department ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {department ? 'Update department settings' : 'Create a new department'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="departement_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Department Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="departement_name"
                      value={formData.departement_name}
                      onChange={(e) => setFormData({ ...formData, departement_name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="max_clock_in_time" className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Clock In Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="max_clock_in_time"
                        value={formData.max_clock_in_time.substring(0, 5)}
                        onChange={(e) => setFormData({ ...formData, max_clock_in_time: e.target.value + ':00' })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Latest time employees can clock in</p>
                  </div>

                  <div className="relative">
                    <label htmlFor="max_clock_out_time" className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Clock Out Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="max_clock_out_time"
                        value={formData.max_clock_out_time.substring(0, 5)}
                        onChange={(e) => setFormData({ ...formData, max_clock_out_time: e.target.value + ':00' })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Latest time employees can clock out</p>
                  </div>
                </div>

                <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-6 py-3 bg-green-600 text-base font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105"
                  >
                    {department ? 'Update Department' : 'Create Department'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200"
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
