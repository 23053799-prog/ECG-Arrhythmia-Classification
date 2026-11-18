import { Activity, BookOpen, FileUp, Info } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { useHealth } from '@/hooks/useHealth';
import { NotForClinicalUse } from '@/components/Banners/NotForClinicalUse';
import { StubModel } from '@/components/Banners/StubModel';

const navigationItems = [
  { to: '/upload', label: 'Upload record', icon: FileUp },
  { to: '/workspace', label: 'Beat workspace', icon: Activity },
  { to: '/model-card', label: 'Model card', icon: BookOpen },
  { to: '/about', label: 'About', icon: Info },
];

export function Layout() {
  const healthQuery = useHealth();
  const isStub = healthQuery.data?.model.is_stub === true;

  const apiStatus = healthQuery.isLoading
    ? 'Checking API…'
    : healthQuery.isError
      ? 'API not connected'
      : 'API connected';

  return (
    <div className="min-h-screen bg-[#fffafd]">
      <NotForClinicalUse />
      <StubModel isStub={isStub} />

      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-pink-100 bg-white px-5 py-7 md:block">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-pink-100 text-pink-700">
              <Activity size={23} aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold tracking-tight text-slate-900">ECG Review Lab</p>
              <p className="text-xs text-slate-500">Research workspace</p>
            </div>
          </div>

          <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Main navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-pink-100 text-pink-900'
                        : 'text-slate-600 hover:bg-pink-50 hover:text-pink-900'
                    }`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50/70 p-4">
            <p className="text-xs font-semibold text-pink-900">Human-led review</p>
            <p className="mt-1 text-xs leading-5 text-pink-800">
              Model labels are suggestions. A person reviews and decides the final label.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 border-b border-pink-100 bg-white/90 px-5 py-4 sm:px-8">
            <div>
              <p className="text-sm font-semibold text-slate-900">ECG beat review</p>
              <p className="text-xs text-slate-500">Education and annotation workspace</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-2 text-xs font-medium text-pink-900">
              <span
                className={`size-2 rounded-full ${healthQuery.isError ? 'bg-amber-500' : healthQuery.isLoading ? 'bg-slate-400' : 'bg-emerald-500'}`}
                aria-hidden="true"
              />
              {apiStatus}
            </div>
          </header>

          <main className="p-5 sm:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
