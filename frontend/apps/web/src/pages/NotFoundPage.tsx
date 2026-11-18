import { Link } from "react-router"

export function NotFoundPage() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center text-center">

      <h1 className="text-6xl font-bold text-pink-600">
        404
      </h1>

      <h2 className="mt-4 text-xl font-bold text-slate-900">
        Page not found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
      >
        Return to overview
      </Link>

    </div>
  )
}