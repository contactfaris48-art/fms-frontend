import {
  FolderIcon,
  CloudArrowUpIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import FileUploadModal from '@/components/files/FileUploadModal';
import { useDashboard } from './useDashboard';

export default function DashboardPage() {
  const { user, stats, uploadModal, storageUsagePercent, formatFileSize } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-indigo-100">
              Manage your files and stay organized with FMS
            </p>
          </div>
          <button
            onClick={uploadModal.open}
            className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            Upload Files
          </button>
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
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  stat.changeType === 'positive'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Files & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Files */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Files</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </button>
          </div>
          <div className="text-center py-12">
            <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No files yet</p>
            <button
              onClick={uploadModal.open}
              className="btn-primary"
            >
              <CloudArrowUpIcon className="h-5 w-5 inline mr-2" />
              Upload Your First File
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={uploadModal.open}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CloudArrowUpIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Files</p>
                <p className="text-sm text-gray-500">Add new files</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-left">
              <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
                <FolderIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Folder</p>
                <p className="text-sm text-gray-500">Organize files</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-left">
              <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
                <DocumentIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Files</p>
                <p className="text-sm text-gray-500">View all files</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Storage Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Storage Usage</span>
              <span className="text-sm text-gray-500">
                {user ? formatFileSize(user.storageUsed) : '0 B'} of{' '}
                {user ? formatFileSize(user.storageQuota) : '0 B'}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                style={{
                  width: `${Math.min(storageUsagePercent, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {storageUsagePercent.toFixed(1)}% used
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal isOpen={uploadModal.isOpen} onClose={uploadModal.close} />
    </div>
  );
}