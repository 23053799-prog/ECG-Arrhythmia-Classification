import {
  Activity,
  LayoutDashboard,
  Upload,
  ClipboardList,
  BookOpen,
  Info,
  CircleHelp,
} from "lucide-react"

import { NavLink, Outlet, useLocation } from "react-router"

import { NotForClinicalUse } from "./Banners/NotForClinicalUse"
import { StubModel } from "./Banners/StubModel"
import { useHealth } from "../hooks/useHealth"

const navigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard, end: true },
  { label: "Upload Record", path: "/upload", icon: Upload },
  { label: "Workspace", path: "/workspace", icon: ClipboardList },
  { label: "Model Card", path: "/model-card", icon: BookOpen },
  { label: "About", path: "/about", icon: Info },
]

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/upload": "Upload Record",
  "/workspace": "Beat Workspace",
  "/model-card": "Model Card",
  "/about": "About",
}

export function Layout() {
  const location = useLocation()
  const { data, isPending, isError } = useHealth()

  const currentTitle = pageTitles[location.pathname] ?? "Page"

  const apiStatus = isPending
    ? "Checking API"
    : isError
      ? "API unavailable"
      : data?.status === "ok"
        ? "API connected"
        : "API status unknown"

  const statusColor = isPending
    ? "bg-amber-400"
    : isError
      ? "bg-rose-500"
      : "bg-emerald-500"

  return (
    <div className="min-h-screen bg-[#fffafd] text-slate-800">
      <NotForClinicalUse />
      <StubModel />

      <div className="flex min-h-[calc(100vh-45px)]">

        {/* LEFT SIDEBAR */}

        <aside className="hidden w-64 shrink-0 border-r border-pink-100 bg-white lg:flex lg:flex-col">

          <div className="flex items-center gap-3 border-b border-pink-100 px-6 py-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
              <Activity size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                ECG Review
              </h1>

              <p className="text-xs text-slate-500">
                Beat annotation assistant
              </p>
            </div>

          </div>

          <div className="px-4 pt-7">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">

              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-pink-100 text-pink-800"
                          : "text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                )
              })}

            </nav>

          </div>

          <div className="mt-auto p-5">

            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">

              <div className="mb-2 flex items-center gap-2 text-pink-800">
                <CircleHelp size={17} />
                <span className="text-sm font-semibold">
                  Research workspace
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                Review model suggestions and make human corrections to
                ECG beat annotations.
              </p>

            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              ECG Beat Review · Research prototype
            </p>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <div className="flex min-w-0 flex-1 flex-col">

          <header className="flex min-h-20 items-center justify-between border-b border-pink-100 bg-white px-5 sm:px-8">

            <div>
              <p className="text-xs font-medium text-pink-600">
                ECG BEAT REVIEW
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {currentTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-white px-3 py-2">

              <span className={`h-2 w-2 rounded-full ${statusColor}`} />

              <span className="text-xs font-medium text-slate-600">
                {apiStatus}
              </span>

            </div>

          </header>

          {/* MOBILE NAVIGATION */}

          <nav className="flex gap-2 overflow-x-auto border-b border-pink-100 bg-white px-4 py-3 lg:hidden">

            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      isActive
                        ? "bg-pink-100 text-pink-800"
                        : "text-slate-600 hover:bg-pink-50"
                    }`
                  }
                >
                  <Icon size={15} />
                  {item.label}
                </NavLink>
              )
            })}

          </nav>

          <main className="flex-1 p-5 sm:p-8">
            <Outlet />
          </main>

        </div>

      </div>
    </div>
  )
}