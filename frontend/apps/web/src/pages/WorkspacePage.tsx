import { Activity } from "lucide-react"

export function WorkspacePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Beat Workspace
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Explore the ECG waveform and review individual beat labels.
        </p>
      </div>

      <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white p-8 text-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
          <Activity size={32} />
        </div>

        <h2 className="mt-5 text-lg font-bold">
          No active record
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Upload an ECG record first. The waveform viewer, beat table,
          review queue and annotation tools will be implemented in
          subsequent phases.
        </p>

      </div>

    </div>
  )
}