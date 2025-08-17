'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { departmentApi, csvExportApi } from '@/lib/api';
import { Department, CreateDepartmentRequest } from '@/types';
import Layout from '@/components/layout/Layout';
import DepartmentModal from '@/components/departments/DepartmentModal';
import { formatTime, downloadCSV } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (data: CreateDepartmentRequest) => {
    try {
      await departmentApi.create(data);
      fetchDepartments();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleUpdateDepartment = async (id: number, data: CreateDepartmentRequest) => {
    try {
      await departmentApi.update(id, data);
      fetchDepartments();
      setIsModalOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.delete(id);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const filteredDepartments = departments.filter(department =>
    department.departement_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = async () => {
    try {
      const blob = await csvExportApi.exportDepartments();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `departments_${timestamp}.csv`;
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
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your company departments and their attendance policies
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex gap-2 items-center"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex gap-2 items-center bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="w-4 h-4" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((department) => (
            <Card key={department.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-10 h-10 bg-green-100 rounded-full">
                      <span className="text-sm font-medium text-green-800">
                        {department.departement_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.departement_name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingDepartment(department);
                        setIsModalOpen(true);
                      }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">Max Clock In:</span>
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                    {formatTime(department.max_clock_in_time)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">Max Clock Out:</span>
                  <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                    {formatTime(department.max_clock_out_time)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No departments found.</p>
          </div>
        )}
      </div>

      {/* Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={editingDepartment ? 
          (data: CreateDepartmentRequest) => handleUpdateDepartment(editingDepartment.id, data) : 
          handleCreateDepartment
        }
        department={editingDepartment}
      />
    </Layout>
  );
}
