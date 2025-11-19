# FMS - File Management System

A modern, full-featured File Management System built with React 19, TypeScript, Redux Toolkit, and Tailwind CSS.

## 🚀 Project Status

### ✅ Completed

- **Project Setup & Configuration**
  - React 19 with TypeScript
  - Vite build tool configuration
  - Tailwind CSS with custom theme
  - PostCSS and Autoprefixer
  - ESLint and Prettier for code quality
  - Environment variables setup

- **State Management**
  - Redux Toolkit store configuration
  - RTK Query for API calls
  - Auth slice with JWT token management
  - UI slice for app state
  - Typed hooks for Redux

- **Type Definitions**
  - Complete TypeScript types for:
    - Authentication (User, Login, Signup)
    - Files (FileItem, Upload, Download)
    - Users (Admin management)
    - API responses and errors
    - Common utilities

- **API Integration Layer**
  - Base API with authentication headers
  - Auth API (login, signup, logout, refresh token)
  - Files API (upload, download, delete, update)
  - Users API (CRUD operations for admin)
  - Storage API (usage stats)

- **Utilities**
  - Constants (routes, API endpoints, error messages)
  - Helper functions (file size formatting, date formatting, etc.)
  - Storage utilities (localStorage operations)

- **Authentication Pages**
  - ✅ Login page with form validation
  - ✅ Signup page with password strength
  - ✅ Protected route wrapper with role-based access
  - 🚧 Forgot password page

- **Layout Components**
  - ✅ Header with navigation and user menu
  - ✅ Sidebar with dynamic menu based on role
  - ✅ Main layout wrapper with responsive design

- **User Dashboard**
  - ✅ Dashboard overview with storage stats
  - ✅ Files page with grid/list view
  - ✅ File upload modal component
  - ✅ Storage quota display
  - ✅ Profile page

- **Admin Dashboard** ✨ **NEW**
  - ✅ Admin overview with system metrics
  - ✅ User management with search and filters
  - ✅ Individual storage quota management
  - ✅ Bulk storage quota updates
  - ✅ Storage monitoring and analytics
  - ✅ User activation/deactivation
  - ✅ Real-time data refresh
  - ✅ Color-coded usage indicators

- **UI Components**
  - ✅ Buttons (primary, secondary)
  - ✅ Input fields with validation
  - ✅ Modals (Headless UI)
  - ✅ Toast notifications (React Hot Toast)
  - ✅ Loading states and spinners
  - ✅ Progress bars for storage
  - ✅ Status badges

### 🚧 To Do

- **Custom Hooks**
  - useAuth - Authentication operations
  - useFileUpload - File upload with progress
  - useFileOperations - File CRUD operations
  - usePermissions - Role-based permissions

- **Additional Features**
  - Forgot password functionality
  - Email notifications
  - File sharing capabilities
  - Advanced search and filters
  - Bulk file operations
  - Storage usage charts
  - Activity logs and audit trail

## 📁 Project Structure

```
fms/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (to be created)
│   ├── pages/          # Page components (to be created)
│   ├── hooks/          # Custom hooks (to be created)
│   ├── store/          # Redux store
│   │   ├── api/        # RTK Query APIs ✅
│   │   ├── slices/     # Redux slices ✅
│   │   ├── hooks.ts    # Typed hooks ✅
│   │   └── index.ts    # Store config ✅
│   ├── types/          # TypeScript types ✅
│   ├── utils/          # Utility functions ✅
│   ├── App.tsx         # Main app component ✅
│   ├── main.tsx        # Entry point ✅
│   └── index.css       # Global styles ✅
├── .env.example        # Environment variables template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## 🛠️ Technologies

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 5.4
- **State Management**: Redux Toolkit 2.9 with RTK Query
- **Routing**: React Router 6.30
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Headless UI 2.2
- **Icons**: Heroicons 2.2
- **Form Management**: React Hook Form 7.65
- **Validation**: Zod 3.25
- **HTTP Client**: Axios 1.13
- **Notifications**: React Hot Toast 2.6

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.development
```

3. Update `.env.development` with your backend API URL:
```env
VITE_API_URL=http://localhost:3000/api
```

### Development

Run the development server:
```bash
pnpm run dev
```

The app will be available at http://localhost:3000

### Build

Build for production:
```bash
pnpm run build
```

Preview production build:
```bash
pnpm run preview
```

### Code Quality

Run ESLint:
```bash
pnpm run lint
```

Format code with Prettier:
```bash
pnpm run format
```

## 🔐 Authentication Flow

The app uses JWT-based authentication:

1. User logs in with credentials
2. Backend returns JWT token + refresh token
3. Token stored in Redux state (and localStorage for persistence)
4. All API requests include `Authorization: Bearer {token}` header
5. Token automatically refreshed before expiry
6. On logout, tokens cleared from state and localStorage

## 📤 File Upload Flow

The app uses S3 pre-signed URLs for secure file uploads:

1. User selects file
2. Frontend requests pre-signed URL from backend
3. Backend validates user quota and generates URL
4. Frontend uploads directly to S3 with progress tracking
5. After upload, frontend confirms with backend
6. Backend saves file metadata to database

**See `S3_INTEGRATION_GUIDE.md` for detailed backend integration**

## 🎨 Styling

The app uses Tailwind CSS with custom utilities:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Input field style
- `.card` - Card container style

Custom theme colors are defined in `tailwind.config.js`

## 📝 API Endpoints

All API endpoints are defined in `src/utils/constants.ts`:

### Auth Endpoints
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Password reset

### Files Endpoints
- `GET /files` - List user files
- `POST /files/upload-url` - Request upload URL
- `POST /files/confirm` - Confirm upload
- `GET /files/:id/download-url` - Get download URL
- `PUT /files/:id` - Update file
- `DELETE /files/:id` - Delete file

### Users Endpoints (Admin)
- `GET /admin/users` - List all users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/quota` - Set storage quota

### Storage Endpoints
- `GET /storage/usage` - Get current user storage
- `GET /admin/storage/stats` - Get system stats (Admin)

## 🔄 State Management

### Redux Slices

- **auth**: User authentication state, JWT tokens
- **ui**: UI state (sidebar, modals, notifications, theme)
- **api**: RTK Query cache and loading states

### Using Redux in Components

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

function MyComponent() {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return <div>Welcome, {user?.firstName}</div>;
}
```

### Using RTK Query

```typescript
import { useGetFilesQuery, useDeleteFileMutation } from '@/store/api/filesApi';

function FilesList() {
  const { data, isLoading, error } = useGetFilesQuery({ page: 1, limit: 20 });
  const [deleteFile] = useDeleteFileMutation();
  
  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId).unwrap();
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Render files */}</div>;
}
```

## 📚 Documentation

- [`FMS_ACTION_PLAN.md`](./FMS_ACTION_PLAN.md) - Complete implementation roadmap
- [`TECHNICAL_SPECIFICATION.md`](./TECHNICAL_SPECIFICATION.md) - API contracts and architecture
- [`S3_INTEGRATION_GUIDE.md`](./S3_INTEGRATION_GUIDE.md) - S3 integration strategy
- [`ADMIN_DASHBOARD_GUIDE.md`](./ADMIN_DASHBOARD_GUIDE.md) - **NEW** Comprehensive admin dashboard guide
- [`ADMIN_FEATURES_SUMMARY.md`](./ADMIN_FEATURES_SUMMARY.md) - **NEW** Quick reference for admin features
- [`DESIGN_PREVIEW_GUIDE.md`](./DESIGN_PREVIEW_GUIDE.md) - UI/UX design guidelines

## 🤝 Backend Integration

The backend developer needs to implement:

1. **Authentication endpoints** with JWT tokens
2. **S3 pre-signed URL generation** for uploads/downloads
3. **File metadata storage** in database
4. **User management** with role-based access
5. **Storage quota tracking** and enforcement

All expected API contracts are documented in `TECHNICAL_SPECIFICATION.md`

## 🎯 Admin Dashboard Features

The admin dashboard provides comprehensive tools for system management:

### Key Features:
- **📊 System Overview**: Real-time metrics and statistics
- **👥 User Management**: Search, filter, and manage users
- **💾 Storage Control**: Individual and bulk quota management
- **📈 Usage Monitoring**: Track storage consumption and trends
- **⚡ Quick Actions**: Fast access to common admin tasks
- **🔄 Real-time Updates**: Automatic data refresh and cache invalidation

### Access Control:
- **Storage Quotas**: Set limits from 1 GB to 1 TB per user
- **Bulk Updates**: Apply quota changes to all users at once
- **User Status**: Activate or deactivate user accounts
- **Role Management**: Admin and user role assignments

### Visual Indicators:
- 🟢 **Green/Purple**: Normal usage (< 70%)
- 🟡 **Yellow**: High usage (70-90%)
- 🔴 **Red**: Critical usage (> 90%)

For detailed information, see [`ADMIN_DASHBOARD_GUIDE.md`](./ADMIN_DASHBOARD_GUIDE.md)

## 📋 Next Steps

1. ✅ ~~Build authentication pages (Login, Signup)~~
2. ✅ ~~Implement protected routes~~
3. ✅ ~~Create layout components (Header, Sidebar)~~
4. ✅ ~~Build user dashboard with file management~~
5. ✅ ~~Implement admin dashboard~~
6. Create custom hooks (`useAuth`, `useFileUpload`, etc.)
7. Add comprehensive error handling
8. Implement file sharing features
9. Add email notifications
10. Write tests and documentation

## 📄 License

MIT

## 👤 Author

Kilo Code Team# fms-frontend
