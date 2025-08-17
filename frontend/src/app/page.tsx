'use client';

import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { employeeApi, departmentApi, attendanceApi } from '@/lib/api';
import { EmployeeWithDepartment, Department, AttendanceLog } from '@/types';
import Layout from '@/components/layout/Layout';
import { formatDate } from '@/lib/utils';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  todayAttendance: number;
  onTimeToday: number;
  lateToday: number;
  attendanceRate: number;
  previousDayAttendance: number;
  attendanceChange: number;
}

interface RecentActivity {
  id: number;
  employee_name: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    onTimeToday: 0,
    lateToday: 0,
    attendanceRate: 0,
    previousDayAttendance: 0,
    attendanceChange: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const [employeesRes, departmentsRes, todayAttendanceRes, yesterdayAttendanceRes] = await Promise.all([
          employeeApi.getAll(),
          departmentApi.getAll(),
          attendanceApi.getLogs({ date: today }),
          attendanceApi.getLogs({ date: yesterday })
        ]);

        const todayLogs = todayAttendanceRes.attendance_logs || [];
        const yesterdayLogs = yesterdayAttendanceRes.attendance_logs || [];
        
        const onTimeCount = todayLogs.filter(log => log.is_on_time).length;
        const lateCount = todayLogs.filter(log => !log.is_on_time).length;
        const attendanceRate = employeesRes.count > 0 ? (todayAttendanceRes.count / employeesRes.count) * 100 : 0;
        const previousDayAttendance = yesterdayAttendanceRes.count;
        const attendanceChange = previousDayAttendance > 0 ? 
          ((todayAttendanceRes.count - previousDayAttendance) / previousDayAttendance) * 100 : 0;

        setStats({
          totalEmployees: employeesRes.count,
          totalDepartments: departmentsRes.count,
          todayAttendance: todayAttendanceRes.count,
          onTimeToday: onTimeCount,
          lateToday: lateCount,
          attendanceRate: Math.round(attendanceRate),
          previousDayAttendance,
          attendanceChange: Math.round(attendanceChange),
        });

        // Generate recent activity from today's attendance logs
        const activity: RecentActivity[] = todayLogs
          .slice(0, 5)
          .map(log => ({
            id: log.id,
            employee_name: log.employee_name,
            action: log.attendance_type === 1 ? 'Clocked In' : 'Clocked Out',
            time: log.date_attendance,
            status: log.is_on_time ? 'success' : 'warning'
          }));

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Total Employees',
      value: stats.totalEmployees,
      icon: UsersIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: null,
    },
    {
      name: 'Total Departments',
      value: stats.totalDepartments,
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: null,
    },
    {
      name: 'Today&apos;s Attendance',
      value: stats.todayAttendance,
      icon: ClockIcon,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: stats.attendanceChange,
    },
    {
      name: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: null,
    },
    {
      name: 'On Time Today',
      value: stats.onTimeToday,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: null,
    },
    {
      name: 'Late Today',
      value: stats.lateToday,
      icon: XCircleIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: null,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
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
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back! Here&apos;s what&apos;s happening with your attendance system today.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Last updated: {formatDate(new Date(), 'dd MMMM yyyy, HH:mm')}
              </p>
            </div>
            <div className="hidden items-center space-x-4 sm:flex">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CalendarIcon className="w-5 h-5" />
                <span>{formatDate(new Date(), 'EEEE, dd MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.change !== null && (
                      <div className={`ml-2 flex items-center text-sm ${
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change >= 0 ? (
                          <ArrowUpIcon className="mr-1 w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="mr-1 w-4 h-4" />
                        )}
                        {Math.abs(stat.change)}%
                      </div>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Attendance Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
              <p className="mt-1 text-sm text-gray-600">Today&apos;s attendance statistics and trends</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.todayAttendance}</div>
                  <div className="mt-1 text-sm text-gray-600">Total Check-ins</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stats.previousDayAttendance} yesterday
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.onTimeToday}</div>
                  <div className="mt-1 text-sm text-gray-600">On Time</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stats.totalEmployees > 0 ? Math.round((stats.onTimeToday / stats.totalEmployees) * 100) : 0}% of total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.lateToday}</div>
                  <div className="mt-1 text-sm text-gray-600">Late</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stats.totalEmployees > 0 ? Math.round((stats.lateToday / stats.totalEmployees) * 100) : 0}% of total
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Attendance Rate</span>
                  <span>{stats.attendanceRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="mt-1 text-sm text-gray-600">Latest attendance activities</p>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.employee_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.time, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ClockIcon className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-600">Common tasks and shortcuts</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex justify-center items-center p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50 group">
                  <UsersIcon className="mr-3 w-6 h-6 text-blue-600 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium text-gray-900">Add Employee</span>
                </button>
                <button className="flex justify-center items-center p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50 group">
                  <BuildingOfficeIcon className="mr-3 w-6 h-6 text-green-600 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium text-gray-900">Add Department</span>
                </button>
                <button className="flex justify-center items-center p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50 group">
                  <ClockIcon className="mr-3 w-6 h-6 text-indigo-600 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium text-gray-900">Clock In</span>
                </button>
                <button className="flex justify-center items-center p-4 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50 group">
                  <ClockIcon className="mr-3 w-6 h-6 text-orange-600 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium text-gray-900">Clock Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="mt-1 text-sm text-gray-600">Current system health and performance</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="mr-3 w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-900">System Status</p>
                      <p className="text-xs text-green-700">All systems operational</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Online
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <ClockIcon className="mr-3 w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">API Response</p>
                      <p className="text-xs text-blue-700">Backend services running</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    Healthy
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="mr-3 w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Performance</p>
                      <p className="text-xs text-indigo-700">Optimal response times</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                    Fast
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
