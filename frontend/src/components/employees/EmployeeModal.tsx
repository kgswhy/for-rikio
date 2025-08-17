'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, IdentificationIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Department, EmployeeWithDepartment, CreateEmployeeRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ((data: CreateEmployeeRequest) => void | Promise<void>) | ((id: number, data: CreateEmployeeRequest) => void | Promise<void>);
  departments: Department[];
  employee?: EmployeeWithDepartment | null;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  departments,
  employee
}: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    employee_id: '',
    departement_id: 1,
    name: '',
    address: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id,
        departement_id: employee.departement_id,
        name: employee.name,
        address: employee.address || ''
      });
    } else {
      setFormData({
        employee_id: '',
        departement_id: 1,
        name: '',
        address: ''
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      (onSubmit as (id: number, data: CreateEmployeeRequest) => void | Promise<void>)(employee.id, formData);
    } else {
      (onSubmit as (data: CreateEmployeeRequest) => void | Promise<void>)(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded-lg">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {employee ? 'Update employee information' : 'Create a new employee record'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id" className="text-sm font-medium">
                Employee ID
              </Label>
              <div className="relative">
                <IdentificationIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Input
                  id="employee_id"
                  type="text"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  placeholder="Enter employee ID"
                  className="pl-10"
                  required
                  disabled={!!employee}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <UserIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Department
              </Label>
              <div className="relative">
                <BuildingOfficeIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Select
                  value={formData.departement_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, departement_id: parseInt(value) })}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.departement_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <div className="relative">
                <MapPinIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address (optional)"
                  className="pl-10 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {employee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
