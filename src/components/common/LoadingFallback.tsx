/**
 * Loading Fallback Component
 * Displays a loading spinner while lazy-loaded components are being fetched
 */
export const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

/**
 * Page Loading Fallback
 * Smaller loading indicator for page transitions
 */
export const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading page...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;