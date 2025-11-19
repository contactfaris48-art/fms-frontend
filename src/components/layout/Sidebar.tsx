import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { ROUTES } from '@/utils/constants';
import { isAdmin } from '@/utils/helpers';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const userNavigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
    { name: 'My Files', href: ROUTES.FILES, icon: FolderIcon },
    { name: 'Settings', href: ROUTES.PROFILE, icon: Cog6ToothIcon },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: ChartBarIcon },
    { name: 'Users', href: ROUTES.ADMIN_USERS, icon: UserGroupIcon },
    { name: 'Storage', href: ROUTES.ADMIN_STORAGE, icon: ChartBarIcon },
  ];

  const navigation = user && isAdmin(user.role) 
    ? [...userNavigation, ...adminNavigation]
    : userNavigation;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Close button (mobile) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => dispatch(setSidebarOpen(false))}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Storage Usage (User only) */}
        {user && !isAdmin(user.role) && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Storage</span>
                <span className="text-xs text-gray-500">
                  {((user.storageUsed / user.storageQuota) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                  style={{ width: `${Math.min((user.storageUsed / user.storageQuota) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {(user.storageUsed / (1024 * 1024 * 1024)).toFixed(2)} GB of{' '}
                {(user.storageQuota / (1024 * 1024 * 1024)).toFixed(0)} GB used
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}