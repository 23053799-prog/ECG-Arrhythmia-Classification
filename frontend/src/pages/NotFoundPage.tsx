import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-pink-50 p-6">
      <div className="max-w-md rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-pink-700">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
        <Link className="mt-5 inline-block font-medium text-pink-700 underline" to="/upload">
          Return to upload page
        </Link>
      </div>
    </main>
  );
}
