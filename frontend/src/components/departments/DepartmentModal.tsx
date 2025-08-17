'use client';

import { useState, useEffect } from 'react';
import { BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Department, CreateDepartmentRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <div className="flex justify-center items-center w-8 h-8 bg-green-100 rounded-lg">
              <BuildingOfficeIcon className="w-4 h-4 text-green-600" />
            </div>
            {department ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
          <DialogDescription>
            {department ? 'Update department settings' : 'Create a new department'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departement_name" className="text-sm font-medium">
                Department Name
              </Label>
              <div className="relative">
                <BuildingOfficeIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  id="departement_name"
                  value={formData.departement_name}
                  onChange={(e) => setFormData({ ...formData, departement_name: e.target.value })}
                  placeholder="Enter department name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_clock_in_time" className="text-sm font-medium">
                  Max Clock In Time
                </Label>
                <div className="relative">
                  <ClockIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="time"
                    id="max_clock_in_time"
                    value={formData.max_clock_in_time.substring(0, 5)}
                    onChange={(e) => setFormData({ ...formData, max_clock_in_time: e.target.value + ':00' })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Latest time employees can clock in</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_clock_out_time" className="text-sm font-medium">
                  Max Clock Out Time
                </Label>
                <div className="relative">
                  <ClockIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="time"
                    id="max_clock_out_time"
                    value={formData.max_clock_out_time.substring(0, 5)}
                    onChange={(e) => setFormData({ ...formData, max_clock_out_time: e.target.value + ':00' })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Latest time employees can clock out</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {department ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
