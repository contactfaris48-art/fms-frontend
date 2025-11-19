import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { formatFileSize } from '@/utils/helpers';
import { useUsersManagement } from './useUsersManagement';

export default function UsersPage() {
  const {
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    newQuota,
    setNewQuota,
    users,
    isLoading,
    isUpdatingQuota,
    editModal,
    handleEditUser,
    handleSaveQuota,
    handleDeleteUser,
    handleToggleStatus,
    refetch,
  } = useUsersManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and their storage quotas</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {users.length}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <ArrowPathIcon className={`h-5 w-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Storage Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quota
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                const usagePercent = (user.storageUsed / user.storageQuota) * 100;
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {formatFileSize(user.storageUsed)}
                          </span>
                          <span className="text-gray-500">{usagePercent.toFixed(0)}%</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        <ChartBarIcon className="h-4 w-4" />
                        {formatFileSize(user.storageQuota)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                          title="Edit quota"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Quota Modal */}
      <Transition appear show={editModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={editModal.close}>
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
                    Edit Storage Quota
                  </Dialog.Title>

                  {editModal.data && (
                    <div className="space-y-6">
                      {/* User Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {editModal.data.firstName[0]}{editModal.data.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {editModal.data.firstName} {editModal.data.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{editModal.data.email}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">
                            Current Usage:{' '}
                            <span className="font-medium text-gray-900">
                              {formatFileSize(editModal.data.storageUsed)}
                            </span>
                          </p>
                          <p className="text-gray-600 mt-1">
                            Current Quota:{' '}
                            <span className="font-medium text-gray-900">
                              {formatFileSize(editModal.data.storageQuota)}
                            </span>
                          </p>
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
                          value={newQuota}
                          onChange={(e) => setNewQuota(e.target.value)}
                          className="input-field"
                          placeholder="10"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Set the maximum storage this user can use
                        </p>
                      </div>

                      {/* Quick Presets */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Quick Presets:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['5', '10', '20', '50'].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => setNewQuota(preset)}
                              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                newQuota === preset
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
                          📊 New Quota: {newQuota} GB ({parseInt(newQuota) * 1024} MB)
                        </p>
                        <p className="text-xs text-indigo-700">
                          This change will take effect immediately
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={editModal.close}
                          className="flex-1 btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveQuota}
                          disabled={isUpdatingQuota}
                          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingQuota ? 'Saving...' : 'Save Quota'}
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}