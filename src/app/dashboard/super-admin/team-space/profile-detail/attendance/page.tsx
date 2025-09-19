'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Clock, Play, Square } from 'lucide-react';
import { useUserAttendance, useCurrentDayAttendance, useAttendanceOperations, useAttendanceStats } from '../../../hooks/useEmployeeOperations';
import { useAuth } from '../../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import { useSearchParams } from 'next/navigation';

function AttendanceTable() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Get employee ID from URL params or use current user
  useEffect(() => {
    const empId = searchParams.get('employeeId');
    setEmployeeId(empId || user?.id || null);
  }, [searchParams, user]);

  // API hooks
  const { attendance, loading: attendanceLoading, error: attendanceError, refetch: refetchAttendance } = useUserAttendance(
    employeeId || '',
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  );

  const { attendance: currentAttendance, hasClockedIn, hasClockedOut, loading: currentLoading } = useCurrentDayAttendance();
  const { clockIn, clockOut, loading: operationLoading } = useAttendanceOperations();
  const { stats, loading: statsLoading } = useAttendanceStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    userId: employeeId || undefined
  });

  const handleClockIn = async () => {
    try {
      await clockIn();
      refetchAttendance();
    } catch (error) {
      console.error('Error clocking in:', error);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut();
      refetchAttendance();
    } catch (error) {
      console.error('Error clocking out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  return (
    <div className="space-y-6">
      {/* Clock In/Out Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Attendance</h3>
            {currentLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-[#E866B7] mr-2" />
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : currentAttendance ? (
              <div className="text-sm text-gray-600">
                <p>Clock In: {formatTime(currentAttendance.clockInTime)}</p>
                {currentAttendance.clockOutTime && (
                  <p>Clock Out: {formatTime(currentAttendance.clockOutTime)}</p>
                )}
                <p>Status: <span className={`font-medium ${currentAttendance.status === 'Late' ? 'text-red-600' : 'text-green-600'}`}>
                  {currentAttendance.status}
                </span></p>
              </div>
            ) : (
              <p className="text-gray-500">No attendance record for today</p>
            )}
          </div>
          <div className="flex gap-3">
            {!hasClockedIn && (
              <button
                onClick={handleClockIn}
                disabled={operationLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Clock In
              </button>
            )}
            {hasClockedIn && !hasClockedOut && (
              <button
                onClick={handleClockOut}
                disabled={operationLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4" />
                Clock Out
              </button>
            )}
            {hasClockedIn && hasClockedOut && (
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                Completed for today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-[#FBB906]">{stats.presentDays}</div>
            <div className="text-sm text-gray-600">Present Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.absentDays}</div>
            <div className="text-sm text-gray-600">Absent Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{stats.lateDays}</div>
            <div className="text-sm text-gray-600">Late Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Date Range:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Break</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Work Hours</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E866B7] mr-2" />
                      <span className="text-gray-600">Loading attendance...</span>
                    </div>
                  </td>
                </tr>
              ) : attendanceError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                    Error loading attendance: {attendanceError}
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={record._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.clockInTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockOutTime ? formatTime(record.clockOutTime) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.breakTime || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.workHours || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                      record.status === 'Late' 
                        ? 'bg-red-500 text-white' 
                          : record.status === 'On Time'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const AttendancePage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin', 'Staff']}>
      <AttendanceTable />
    </ProtectedRoute>
  );
};

export default AttendancePage;