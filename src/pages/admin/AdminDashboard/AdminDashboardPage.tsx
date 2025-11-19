import {
  UserGroupIcon,
  ServerIcon,
  FolderIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useAdminDashboard } from './useAdminDashboard';
import { ROUTES } from '@/utils/constants';

export default function AdminDashboardPage() {
  const {
    user,
    stats,
    recentUsers,
    storageStats,
    storageUsagePercent,
    usersLoading,
    storageLoading,
    navigateToUsers,
    navigateToStorage,
    formatFileSize,
  } = useAdminDashboard();

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
            <p className="text-purple-100">
              System overview and management
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-purple-200">Logged in as</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.changeType === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            <button
              onClick={navigateToUsers}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </button>
          </div>
          {usersLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading users...</p>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => {
                const usagePercent = (u.storageUsed / u.storageQuota) * 100;
                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={navigateToUsers}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        {u.isActive ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              usagePercent > 90
                                ? 'bg-red-500'
                                : usagePercent > 70
                                ? 'bg-yellow-500'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatFileSize(u.storageUsed)} / {formatFileSize(u.storageQuota)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Actions</h2>
          <div className="space-y-3">
            <button
              onClick={navigateToUsers}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <UserGroupIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">View all users</p>
              </div>
            </button>

            <button
              onClick={navigateToStorage}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
                <ServerIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Storage Management</p>
                <p className="text-sm text-gray-500">Manage quotas</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-left">
              <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
                <ChartBarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">System stats</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">System Storage</h2>
          <button
            onClick={navigateToStorage}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Details →
          </button>
        </div>
        {storageLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {storageStats ? formatFileSize(storageStats.totalStorage) : '0 GB'}
                </div>
                <div className="text-sm text-gray-600">Total Allocated</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {storageStats ? formatFileSize(storageStats.totalUsed) : '0 GB'}
                </div>
                <div className="text-sm text-gray-600">Currently Used</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {storageStats ? formatFileSize(storageStats.totalAvailable) : '0 GB'}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
            {storageStats && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Overall Usage</span>
                  <span className="text-gray-500">
                    {storageUsagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{
                      width: `${Math.min(storageUsagePercent, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {recentUsers.slice(0, 3).map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{u.firstName} {u.lastName}</span> joined the system
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="text-center py-12">
              <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}