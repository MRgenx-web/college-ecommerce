// Catch-all 404 page for unmatched routes.
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-800">Page not found</h1>
      <p className="mt-2 max-w-sm text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default ErrorPage;
