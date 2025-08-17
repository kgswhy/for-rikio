'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ClockIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Employees', href: '/employees', icon: UsersIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Attendance', href: '/attendance', icon: ClockIcon },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
          <div className="flex justify-between items-center px-6 h-16 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex justify-center items-center mr-3 w-8 h-8 bg-blue-600 rounded-lg">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Rikio</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="px-6 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "text-blue-700 bg-blue-50 border border-blue-200 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className={cn(
                        "mr-3 w-5 h-5 transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-gray-500"
                      )} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex overflow-y-auto flex-col gap-y-5 px-6 pb-4 bg-white border-r border-gray-200 grow">
          <div className="flex items-center h-16 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex justify-center items-center mr-3 w-8 h-8 bg-blue-600 rounded-lg">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Rikio</h1>
            </div>
          </div>
          <nav className="flex flex-col flex-1">
            <ul className="flex flex-col flex-1 gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex gap-x-3 p-3 text-sm font-medium leading-6 rounded-lg transition-all duration-200 group",
                            isActive
                              ? "text-blue-700 bg-blue-50 border border-blue-200 shadow-sm"
                              : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                          )}
                        >
                          <item.icon className={cn(
                            "w-6 h-6 transition-colors duration-200 shrink-0",
                            isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                          )} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Cog6ToothIcon className="mr-3 w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">System</p>
                      <p className="text-xs text-gray-500">v1.0.0</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="flex sticky top-0 z-40 gap-x-6 items-center px-4 py-4 bg-white border-b border-gray-200 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-50 rounded-lg transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="flex flex-1 items-center">
          <div className="flex justify-center items-center mr-3 w-6 h-6 bg-blue-600 rounded-lg">
            <ClockIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm font-semibold leading-6 text-gray-900">
            Rikio
          </div>
        </div>
      </div>
    </>
  );
}
