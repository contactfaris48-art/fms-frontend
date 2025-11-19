import {
  ServerIcon,
  ChartBarIcon,
  UsersIcon,
  FolderIcon,
  ArrowPathIcon,
  PencilIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useStorage } from './useStorage';

export default function StoragePage() {
  const {
    displayStats,
    topUsers,
    storageLoading,
    usersLoading,
    bulkQuotaModal,
    bulkQuotaValue,
    setBulkQuotaValue,
    handleBulkQuotaUpdate,
    handleRefresh,
    navigateToUsers,
    storageUsagePercent,
    formatFileSize,
  } = useStorage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage system storage</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center gap-2"
            disabled={storageLoading || usersLoading}
          >
            <ArrowPathIcon className={`h-5 w-5 ${storageLoading || usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={bulkQuotaModal.open}
            className="btn-primary flex items-center gap-2"
          >
            <PencilIcon className="h-5 w-5" />
            Bulk Update Quotas
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {storageLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading storage data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <ServerIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Allocated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(displayStats.totalStorage)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Currently Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(displayStats.totalUsed)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(displayStats.totalAvailable)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayStats.userCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Storage Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Storage Usage</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">System Storage</span>
            <span className="text-gray-500">
              {formatFileSize(displayStats.totalUsed)} of{' '}
              {formatFileSize(displayStats.totalStorage)}
            </span>
          </div>
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full flex items-center justify-end pr-3 ${
                storageUsagePercent > 90
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : storageUsagePercent > 70
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              }`}
              style={{
                width: `${Math.min(storageUsagePercent, 100)}%`,
              }}
            >
              <span className="text-xs font-medium text-white">
                {storageUsagePercent.toFixed(1)}%
              </span>
            </div>
          </div>
          {storageUsagePercent > 80 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Storage usage is high. Consider increasing quotas or cleaning up files.</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Users by Storage */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Users by Storage</h2>
          <button
            onClick={navigateToUsers}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Manage All →
          </button>
        </div>
        {usersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : topUsers.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topUsers.map((user, index) => {
            const usagePercent = (user.storageUsed / user.storageQuota) * 100;
            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatFileSize(user.storageUsed)}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {formatFileSize(user.storageQuota)}
                  </p>
                </div>
                <div className="w-32">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {usagePercent.toFixed(0)}%
                  </p>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Storage Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Storage Distribution</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* By User Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By User Type</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Regular Users</span>
                <span className="text-sm font-bold text-blue-600">
                  {formatFileSize(displayStats.totalUsed)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Admin Users</span>
                <span className="text-sm font-bold text-purple-600">0 B</span>
              </div>
            </div>
          </div>

          {/* By File Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By File Type</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Documents</span>
                <span className="text-sm font-bold text-gray-600">0 B</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Images</span>
                <span className="text-sm font-bold text-gray-600">0 B</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Videos</span>
                <span className="text-sm font-bold text-gray-600">0 B</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Others</span>
                <span className="text-sm font-bold text-gray-600">0 B</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Quota Update Modal */}
      <Transition appear show={bulkQuotaModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={bulkQuotaModal.close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                  <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Bulk Update Storage Quotas
                  </Dialog.Title>

                  <div className="space-y-6">
                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Warning</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            This will update the storage quota for all {topUsers.length} users in the system.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quota Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Storage Quota (GB)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={bulkQuotaValue}
                        onChange={(e) => setBulkQuotaValue(e.target.value)}
                        className="input-field"
                        placeholder="10"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Set the storage quota for all users
                      </p>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Quick Presets:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {['5', '10', '20', '50'].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setBulkQuotaValue(preset)}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${
                              bulkQuotaValue === preset
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {preset} GB
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-indigo-50 rounded-xl p-4">
                     <p className="text-sm text-indigo-900 font-medium mb-2">
                       📊 Total Allocation: {parseInt(bulkQuotaValue) * topUsers.length} GB
                     </p>
                     <p className="text-xs text-indigo-700">
                       {topUsers.length} users × {bulkQuotaValue} GB each
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={bulkQuotaModal.close}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkQuotaUpdate}
                        className="flex-1 btn-primary"
                      >
                        Update All Quotas
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}